
import "dotenv/config";
import { Worker, Job, QueueEvents } from "bullmq";
import { redis } from "@/lib/redis";
import { CLIPS_OUTPUT_DIR } from "@/lib/env";
import { ensureOutDir, cutVerticalWithSubs } from "@/lib/ffmpeg";
import { writeSrtForWindow } from "@/lib/srt";
import { selectHighlightWindows } from "@/lib/highlight";
import { getTranscript } from "@/worker/transcript";
import { getVideoPlayableUrl } from "@/worker/youtube-source";
import { v4 as uuidv4 } from "uuid";

export type ClipJobData = { videoId: string; title: string };

ensureOutDir();

const events = new QueueEvents("clip-jobs", { connection: redis });

events.on("waiting", ({ jobId }) => {
  console.log("[queue] waiting", jobId);
});

events.on("active", ({ jobId, prev }) => {
  console.log("[queue] active", jobId, prev);
});

events.on("completed", ({ jobId, returnvalue }) => {
  console.log("[queue] completed", jobId, returnvalue);
});

events.on("failed", ({ jobId, failedReason }) => {
  console.log("[queue] failed", jobId, failedReason);
});

console.log("[worker] starting");

export const worker = new Worker<ClipJobData>(
  "clip-jobs",
  async (job: Job<ClipJobData>) => {
    try {
      console.log("[worker] processing", job.id, job.data.videoId);
      const { videoId, title } = job.data;
      const transcript = await getTranscript(videoId);
      if (!transcript.length) {
      }
      if (!transcript.length) {
        console.log("[worker] no transcript", videoId);
        return { status: "no_transcript" };
      }
      const windows = selectHighlightWindows(transcript, 30, 5, 2);
      console.log("[worker] windows", windows.length);
      const results: any[] = [];
      const inputUrl = await getVideoPlayableUrl(videoId);
      if (!inputUrl) {
      }
      if (!inputUrl) {
        console.log("[worker] not playable", videoId);
        return { status: "not_playable" };
      }
      for (const w of windows) {
        const id = uuidv4();
        const srtPath = `${CLIPS_OUTPUT_DIR}/${id}.srt`;
        const outPath = `${CLIPS_OUTPUT_DIR}/${id}.mp4`;
        writeSrtForWindow(transcript, w.start, w.end, srtPath);
        await cutVerticalWithSubs(inputUrl, w.start, w.end, srtPath, outPath);
        results.push({ outPath, srtPath, start: w.start, end: w.end, title });
        console.log("[worker] clip done", outPath);
      }
      return { status: "ok", clips: results };
    } catch (e: any) {
      console.log("[worker] error", e?.message || e);
      return { status: "error", message: String(e?.message || e) };
    }
  },
  { connection: redis, concurrency: 2 }
);

worker.on("ready", () => {
  console.log("[worker] ready");
});

worker.on("error", (err) => {
  console.log("[worker] error", err?.message || err);
});
