import "dotenv/config";
import { YoutubeTranscript } from "youtube-transcript";
import ytdl from "ytdl-core";
import { spawn } from "node:child_process";
import { createReadStream, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import FormData from "form-data";
import { getFfmpegPath } from "@/lib/ffmpeg-path";

export type TItem = { text: string; offset: number; duration: number };

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
const AL = "en-US,en;q=0.9";

function ytHeaders() {
  const cookie = process.env.YTCOOKIE || process.env.YOUTUBE_COOKIE || "";
  return { cookie, "user-agent": UA, "accept-language": AL };
}

function log(...args: any[]) {
  console.log("[transcript]", ...args);
}

function run(cmd: string, args: string[], opts: { stdio?: any } = {}) {
  return new Promise<{ code: number; stdout: string; stderr: string }>(
    (resolve, reject) => {
      const p = spawn(cmd, args, { stdio: opts.stdio || "pipe" });
      let out = "";
      let err = "";
      if (p.stdout) {
      }
      if (p.stdout) {
        p.stdout.on("data", (d) => (out += d.toString()));
      }
      if (p.stderr) {
      }
      if (p.stderr) {
        p.stderr.on("data", (d) => (err += d.toString()));
      }
      p.on("error", reject);
      p.on("close", (code) =>
        resolve({ code: code ?? -1, stdout: out, stderr: err })
      );
    }
  );
}

function ytDlpBaseArgs() {
  const cookie = ytHeaders().cookie;
  const args: string[] = [];
  if (cookie.length > 0) {
  }
  if (cookie.length > 0) {
    args.push(
      "--add-header",
      `Cookie: ${cookie}`,
      "--add-header",
      `User-Agent: ${UA}`,
      "--add-header",
      `Accept-Language: ${AL}`
    );
  } else {
  }
  if (cookie.length === 0) {
    const browser = process.env.YTDLP_BROWSER || "edge";
    args.push("--cookies-from-browser", browser);
  }
  return args;
}

async function runYtDlp(args: string[]) {
  const pref = process.env.YTDLP_PATH || "";
  const tries: Array<{ cmd: string; argv: string[]; tag: string }> = [];
  if (pref.length > 0) {
  }
  if (pref.length > 0) {
    tries.push({ cmd: pref, argv: args, tag: pref });
  }
  tries.push({ cmd: "yt-dlp", argv: args, tag: "yt-dlp" });
  tries.push({ cmd: "yt-dlp.exe", argv: args, tag: "yt-dlp.exe" });
  for (const t of tries) {
    log("spawn", t.tag, args.join(" "));
    const r = await run(t.cmd, t.argv);
    log("exit", t.tag, r.code, r.stderr.split("\n").slice(-5).join(" | "));
    if (r.code === 0) {
    }
    if (r.code === 0) {
      return { ok: true, stderr: r.stderr };
    }
  }
  return { ok: false, stderr: "all yt-dlp attempts failed" };
}

export async function getTranscript(videoId: string): Promise<TItem[]> {
  const forceAsr = String(process.env.FORCE_ASR || "").toLowerCase() === "true";
  const hasCookie = Boolean(ytHeaders().cookie);
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  log("start", { videoId, forceAsr, hasCookie, hasKey });
  if (!forceAsr) {
  }
  if (!forceAsr) {
    const cap = await tryCaptions(videoId);
    log("captions", cap.length);
    if (cap.length > 0) {
    }
    if (cap.length > 0) {
      return cap;
    }
  }
  const asr = await tryAsr(videoId);
  log("asr", asr.length);
  if (asr.length > 0) {
  }
  if (asr.length > 0) {
    return asr;
  }
  log("returning empty");
  return [];
}

async function tryCaptions(videoId: string): Promise<TItem[]> {
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    const mapped = items.map((x) => ({
      text: x.text,
      offset: x.offset,
      duration: x.duration,
    }));
    if (mapped.length > 0) {
    }
    if (mapped.length > 0) {
      return mapped;
    }
  } catch (e: any) {
    log("youtube-transcript error", e?.message || String(e));
  }
  try {
    const base = join(tmpdir(), `yt_${videoId}_${Date.now()}`);
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const args = [
      ...ytDlpBaseArgs(),
      "--skip-download",
      "--write-auto-sub",
      "--sub-format",
      "json3",
      "--sub-langs",
      "en.*",
      "-o",
      base,
      url,
    ];
    const r = await runYtDlp(args);
    if (!r.ok) {
    }
    if (!r.ok) {
      log("yt-dlp subs error", r.stderr);
      return [];
    }
    const subPath = `${base}.en.json3`;
    if (!existsSync(subPath)) {
    }
    if (!existsSync(subPath)) {
      log("no json3 file", subPath);
      return [];
    }
    const data = readFileSync(subPath, "utf8");
    const json = JSON.parse(data);
    const events = Array.isArray(json.events) ? json.events : [];
    const out: TItem[] = [];
    for (const ev of events) {
      const segs = ev.segs || [];
      const tStartMs = Number(ev.tStartMs) || 0;
      const dMs = Number(ev.dDurationMs) || 0;
      let text = "";
      for (const s of segs) {
        text += String(s.utf8 || "");
      }
      text = text.trim();
      if (text.length > 0) {
      }
      if (text.length > 0) {
        out.push({ text, offset: tStartMs / 1000, duration: dMs / 1000 });
      }
    }
    return out;
  } catch (e: any) {
    log("yt-dlp subs throw", e?.message || String(e));
    return [];
  }
}

async function tryAsr(videoId: string): Promise<TItem[]> {
  const audioPath = await extractAudioMp3(videoId).catch((e) => {
    log("extractAudio error", e?.message || String(e));
    return "";
  });
  if (!audioPath) {
  }
  if (!audioPath) {
    return [];
  }
  try {
    const out = await openaiWhisper(audioPath);
    return out;
  } finally {
    safeRm(audioPath);
  }
}

function extractAudioMp3(videoId: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const base = join(tmpdir(), `aud_${videoId}_${Date.now()}`, "audio");
    const mp3A = `${base}.mp3`;
    try {
      const info = await ytdl.getInfo(url, {
        requestOptions: { headers: ytHeaders() },
      });
      if (!info) {
      }
      if (!info) {
        reject(new Error("no_info"));
        return;
      }
      if (info.videoDetails.isLiveContent) {
      }
      if (info.videoDetails.isLiveContent) {
        reject(new Error("live_not_supported"));
        return;
      }
      const cmd = getFfmpegPath();
      log("ytdl+ffmpeg start");
      const proc = spawn(
        cmd,
        [
          "-y",
          "-i",
          "pipe:0",
          "-vn",
          "-acodec",
          "libmp3lame",
          "-ar",
          "16000",
          "-ac",
          "1",
          mp3A,
        ],
        { stdio: ["pipe", "pipe", "pipe"] }
      );
      let serr = "";
      proc.stderr.on("data", (d) => (serr += d.toString()));
      const stream = ytdl.downloadFromInfo(info, {
        quality: "highestaudio",
        filter: "audioonly",
        requestOptions: { headers: ytHeaders() },
      });
      stream.on("error", reject);
      proc.on("error", reject);
      proc.on("close", (code) => {
        log("ffmpeg exit", code, serr.split("\n").slice(-5).join(" | "));
        if (code === 0) {
        }
        if (code === 0) {
          resolve(mp3A);
          return;
        }
        reject(new Error("ffmpeg_exit"));
      });
      stream.pipe(proc.stdin);
    } catch (e: any) {
      log("ytdl path failed", e?.statusCode || e?.message || String(e));
      const url2 = `https://www.youtube.com/watch?v=${videoId}`;
      const args = [
        ...ytDlpBaseArgs(),
        "-f",
        "bestaudio",
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "--postprocessor-args",
        "a=-ac 1 -ar 16000",
        "-o",
        `${base}.%(ext)s`,
        url2,
      ];
      const r = await runYtDlp(args);
      if (r.ok && existsSync(mp3A)) {
      }
      if (r.ok && existsSync(mp3A)) {
        resolve(mp3A);
        return;
      }
      reject(new Error(r.ok ? "yt-dlp_ok_but_no_file" : r.stderr));
    }
  });
}

async function openaiWhisper(filePath: string): Promise<TItem[]> {
  const key = process.env.OPENAI_API_KEY || "";
  if (key.length === 0) {
  }
  if (key.length === 0) {
    log("no OPENAI_API_KEY");
    return [];
  }
  const fd = new FormData();
  fd.append("model", "whisper-1");
  fd.append("response_format", "verbose_json");
  fd.append("file", createReadStream(filePath), {
    filename: "audio.mp3",
    contentType: "audio/mpeg",
  });
  log("calling whisper", {
    size: existsSync(filePath) ? true : false,
    dir: dirname(filePath),
  });
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` as string, ...fd.getHeaders() },
    body: fd as any,
  });
  if (!res.ok) {
  }
  if (!res.ok) {
    log("whisper http", res.status);
    return [];
  }
  const json = (await res.json()) as any;
  console.log("OPENAI response:", json);
  const segments = Array.isArray(json.segments) ? json.segments : [];
  const out: TItem[] = [];
  for (const s of segments) {
    const start = Number(s.start) || 0;
    const end = Number(s.end) || start;
    const text = String(s.text || "").trim();
    if (text.length > 0) {
    }
    if (text.length > 0) {
      out.push({ text, offset: start, duration: Math.max(0, end - start) });
    }
  }
  if (out.length > 0) {
  }
  if (out.length > 0) {
    return out;
  }
  const text = String(json.text || "").trim();
  if (text.length === 0) {
  }
  if (text.length === 0) {
    return [];
  }
  return [
    { text, offset: 0, duration: Math.max(1, text.split(/\s+/).length / 2.5) },
  ];
}

function safeRm(p: string) {
  try {
    rmSync(p, { force: true });
  } catch {}
}
