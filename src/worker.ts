import { Worker, Job } from "bullmq";
import { connection } from "./lib/queue";
import { prisma } from "./lib/prisma";
import "./worker-tiktok";
import {
  getVideoMetadata,
  downloadVideo,
  cleanupUserCookiesFile,
} from "./services/youtube";
import {
  extractAudio,
  compressAudioForTranscription,
  renderVerticalClip,
  renderSmartFramedClip,
  extractThumbnail,
  createSrtFile,
  detectScenes,
  probeBitrate,
  probeVideo,
} from "./services/ffmpeg";
import { transcribeAudio } from "./services/openai";
import { scoreClip } from "./services/openai";
import { detectSegments } from "./services/segmentation";
import {
  detectEnhancedSegments,
  mineTimestampsFromComments,
} from "./services/segmentation-v2";
import {
  fetchVideoComments,
  extractVideoIdFromUrl,
} from "./services/youtube-comments";
import { uploadFile } from "./services/s3";
import { join } from "path";
import { mkdirSync, existsSync, rmSync } from "fs";
import { tmpdir } from "os";
import { cleanupTempFiles } from "./lib/cleanup";
import {
  computeCropMap,
  buildPiecewiseExpr,
  Constraints,
} from "./services/framingService";

interface VideoJob {
  videoId: string;
  userId: string;
}

async function checkCancelled(videoId: string) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { status: true },
  });

  if (video?.status === "cancelled") {
    throw new Error("Video processing was cancelled by user");
  }
}

async function processVideo(job: Job<VideoJob>) {
  const { videoId, userId } = job.data;

  if (!userId) {
    throw new Error("User ID is required for video processing");
  }

  await prisma.video.update({
    where: { id: videoId },
    data: { status: "processing" },
  });

  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { user: true },
  });

  if (!video) {
    throw new Error(`Video ${videoId} not found`);
  }

  if (!video.user.youtubeCookies) {
    throw new Error(
      "YouTube cookies not configured. Please upload your YouTube cookies.",
    );
  }

  const workDir = join(tmpdir(), `video_${videoId}`);

  if (!existsSync(workDir)) {
    mkdirSync(workDir, { recursive: true });
  }

  try {
    const videoPath = join(workDir, "source.mp4");
    const audioPath = join(workDir, "audio.m4a");
    const transcriptionAudioPath = join(workDir, "audio_transcription.mp3");

    console.log(`Fetching video metadata for chapters`);
    const metadata = await getVideoMetadata(video.sourceUrl, userId);
    console.log(`Found ${metadata.chapters.length} chapters`);

    if (metadata.chapters.length > 0) {
      metadata.chapters.forEach((ch, i) => {
        console.log(
          `  Chapter ${i + 1}: ${ch.title} (${ch.startSec.toFixed(1)}s - ${ch.endSec.toFixed(1)}s)`,
        );
      });
    }

    await checkCancelled(videoId);

    console.log(`Downloading video: ${video.sourceUrl}`);
    const sourceInfo = await downloadVideo(video.sourceUrl, videoPath, userId);
    console.log(
      `Source: ${sourceInfo.height}p ${sourceInfo.fps}fps ${sourceInfo.vcodec} @ ${sourceInfo.tbr}kbps`,
    );

    await checkCancelled(videoId);

    console.log(`Validating source quality`);
    const br = await probeBitrate(videoPath);
    console.log(
      `Measured bitrate: ${br.kbps.toFixed(0)} kbps, size: ${(br.size / 1024 / 1024).toFixed(1)} MB, duration: ${br.seconds.toFixed(1)}s`,
    );

    const minBitrate =
      sourceInfo.height >= 1080 ? 3000 : sourceInfo.height >= 720 ? 1500 : 1000;

    if (br.kbps < minBitrate) {
      console.warn(
        `⚠️  Quality Gate: Source bitrate ${br.kbps.toFixed(0)} kbps is below recommended ${minBitrate} kbps for ${sourceInfo.height}p`,
      );
    } else {
      console.log(
        `✓ Quality Gate: Source quality meets ${sourceInfo.height}p standards (${br.kbps.toFixed(0)} >= ${minBitrate} kbps)`,
      );
    }

    await checkCancelled(videoId);

    console.log(`Extracting audio`);
    await extractAudio(videoPath, audioPath);

    console.log(`Compressing audio for transcription`);
    await compressAudioForTranscription(audioPath, transcriptionAudioPath);

    await checkCancelled(videoId);

    console.log(`Transcribing audio`);
    const transcript = await transcribeAudio(
      transcriptionAudioPath,
      metadata.chapters,
    );

    await checkCancelled(videoId);

    await prisma.video.update({
      where: { id: videoId },
      data: { transcript: transcript as any },
    });

    console.log(`Detecting scene changes`);
    const sceneChanges = await detectScenes(videoPath);
    console.log(`Found ${sceneChanges.length} scene changes`);

    await checkCancelled(videoId);

    let commentHotspots: number[] = [];

    const ytVideoId = extractVideoIdFromUrl(video.sourceUrl);
    
    if (ytVideoId) {
      console.log(`Fetching YouTube comments for engagement analysis`);
      const comments = await fetchVideoComments(ytVideoId, 100);
      
      if (comments.length > 0) {
        commentHotspots = mineTimestampsFromComments(comments);
        console.log(`Found ${commentHotspots.length} comment hotspots at: ${commentHotspots.map(t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`).join(', ')}`);
      } else {
        console.log(`No comments found, using engagement score defaults`);
      }
      
      await prisma.video.update({
        where: { id: videoId },
        data: { commentTimestampHotspotsJson: commentHotspots as any }
      });
    } else {
      console.log(`Could not extract video ID, skipping comment fetching`);
      
      await prisma.video.update({
        where: { id: videoId },
        data: { commentTimestampHotspotsJson: [] as any }
      });
    }

    console.log(`Detecting segments with enhanced v2 algorithm`);
    const segments = detectEnhancedSegments(
      transcript,
      sceneChanges,
      metadata.chapters,
      video.durationSec,
      commentHotspots,
    );

    console.log(`Found ${segments.length} candidate segments`);

    await checkCancelled(videoId);

    const processSegment = async (segment: any, i: number) => {
      await checkCancelled(videoId);

      console.log(`Processing segment ${i + 1}/${segments.length}`);

      const clipId = `clip_${Date.now()}_${videoId}_${i}`;
      const clipDir = join(workDir, `clip_${i}`);

      if (!existsSync(clipDir)) {
        mkdirSync(clipDir, { recursive: true });
      }

      const clipPath = join(clipDir, "clip.mp4");
      const thumbPath = join(clipDir, "thumb.jpg");
      const srtPath = join(clipDir, "clip.srt");

      const adjustedWords = segment.words.map((w: any) => ({
        word: w.word,
        start: w.start - segment.startSec,
        end: w.end - segment.startSec,
      }));

      createSrtFile(adjustedWords, srtPath);

      let cropMap = null;
      let smartFramed = false;

      if (process.env.FEATURE_SMART_FRAMING === "true") {
        try {
          const probe = await probeVideo(videoPath);
          const constraints: Constraints = {
            margin: Number(process.env.FRAMING_SAFETY_MARGIN || 0.12),
            maxPan: Number(process.env.FRAMING_MAX_PAN_PX_PER_S || 600),
            easeMs: Number(process.env.FRAMING_EASE_MS || 250),
            centerBiasY: Number(process.env.FRAMING_CENTER_BIAS_Y || 0.08),
            safeTop: Number(process.env.FRAMING_TOP_SAFE_PCT || 0.1),
            safeBottom: Number(process.env.FRAMING_BOTTOM_SAFE_PCT || 0.15),
          };

          const transcriptWords = segment.words.map((w: any) => ({
            t: w.start,
            end: w.end,
            text: w.word,
            speaker: w.speaker,
          }));

          cropMap = await computeCropMap(
            {
              videoPath,
              baseW: probe.width,
              baseH: probe.height,
              segStart: segment.startSec,
              segEnd: segment.endSec,
              transcript: transcriptWords,
            },
            constraints,
          );

          if (cropMap) {
            const exprX = buildPiecewiseExpr(cropMap, "x");
            const exprY = buildPiecewiseExpr(cropMap, "y");
            const cropW = Math.floor((probe.height * 9) / 16);
            const cropH = probe.height;

            await renderSmartFramedClip({
              inputPath: videoPath,
              outputPath: clipPath,
              startTime: segment.startSec,
              duration: segment.durationSec,
              srtPath,
              hookText: segment.hook,
              cropMapExprX: exprX,
              cropMapExprY: exprY,
              cropW,
              cropH,
            });

            smartFramed = true;
            console.log(
              `  Smart framing applied with ${cropMap.length} keyframes`,
            );
          }
        } catch (err) {
          console.error(
            "Smart framing failed, falling back to standard crop:",
            err,
          );
        }
      }

      if (!smartFramed) {
        await renderVerticalClip({
          inputPath: videoPath,
          outputPath: clipPath,
          startTime: segment.startSec,
          duration: segment.durationSec,
          srtPath,
          hookText: segment.hook,
        });
      }

      const clipBitrate = await probeBitrate(clipPath);
      console.log(
        `  Output: ${(clipBitrate.size / 1024 / 1024).toFixed(1)} MB @ ${clipBitrate.kbps.toFixed(0)} kbps`,
      );

      const [_, scores] = await Promise.all([
        extractThumbnail(clipPath, thumbPath, 1),
        scoreClip(video.title, segment.hook, segment.text),
      ]);

      const s3VideoKey = `videos/${videoId}/clips/${clipId}/clip.mp4`;
      const s3ThumbKey = `videos/${videoId}/clips/${clipId}/thumb.jpg`;
      const s3SrtKey = `videos/${videoId}/clips/${clipId}/clip.srt`;

      await Promise.all([
        uploadFile(s3VideoKey, clipPath, "video/mp4"),
        uploadFile(s3ThumbKey, thumbPath, "image/jpeg"),
        uploadFile(s3SrtKey, srtPath, "text/plain"),
      ]);

      await prisma.clip.create({
        data: {
          id: clipId,
          videoId,
          startSec: Math.floor(segment.startSec),
          endSec: Math.floor(segment.endSec),
          durationSec: Math.floor(segment.durationSec),
          category: scores.category,
          tags: scores.tags,
          scoreHook: scores.scores.hook_strength,
          scoreRetention: scores.scores.retention_likelihood,
          scoreClarity: scores.scores.clarity,
          scoreShare: scores.scores.shareability,
          scoreOverall: scores.scores.overall,
          rationale: scores.rationale,
          rationaleShort: segment.rationaleShort || scores.rationale,
          featuresJson: segment.features ? (segment.features as any) : null,
          durationChoice: segment.durationChoice || null,
          s3VideoKey,
          s3ThumbKey,
          s3SrtKey,
          smartFramed,
          cropMapJson: cropMap ? (cropMap as any) : null,
        },
      });

      console.log(`Segment ${i + 1} completed`);
    };

    const clipSuccesses: string[] = [];
    const clipFailures: Array<{ index: number; error: any }> = [];

    for (let i = 0; i < segments.length; i += 2) {
      const batch = segments.slice(i, i + 2);
      const results = await Promise.allSettled(
        batch.map((seg, idx) => processSegment(seg, i + idx)),
      );

      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        const clipIndex = i + j;

        if (result.status === "fulfilled") {
          clipSuccesses.push(`clip_${clipIndex}`);
        } else {
          console.error(`Clip ${clipIndex + 1} failed:`, result.reason);
          clipFailures.push({ index: clipIndex, error: result.reason });
        }
      }
    }

    const summary = {
      totalSegments: segments.length,
      successfulClips: clipSuccesses.length,
      failedClips: clipFailures.length,
      failures: clipFailures.map((f) => ({
        clip: `clip_${f.index}`,
        error: f.error?.message || String(f.error),
      })),
    };

    console.log("Processing summary:", JSON.stringify(summary, null, 2));

    await prisma.video.update({
      where: { id: videoId },
      data: { status: "completed" },
    });

    console.log(
      `Video ${videoId} processing completed with ${clipSuccesses.length} successful clips and ${clipFailures.length} failures`,
    );
  } catch (error: any) {
    console.error(`Error processing video ${videoId}:`, error);

    if (error?.message?.includes("cancelled by user")) {
      console.log(
        `Video ${videoId} was cancelled by user, keeping cancelled status`,
      );
    } else {
      await prisma.video.update({
        where: { id: videoId },
        data: { status: "failed" },
      });
    }

    throw error;
  } finally {
    cleanupUserCookiesFile(userId);

    if (existsSync(workDir)) {
      rmSync(workDir, { recursive: true, force: true });
    }
  }
}

const worker = new Worker<VideoJob>("video.process", processVideo, {
  connection,
  concurrency: 1,
  lockDuration: 1800000,
  lockRenewTime: 30000,
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

cleanupTempFiles();
console.log("Worker started");
