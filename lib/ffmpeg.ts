import { spawn } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { CLIPS_OUTPUT_DIR } from "@/lib/env";
import { getFfmpegPath } from "./ffmpeg-path";

export function ensureOutDir() {
  if (!existsSync(CLIPS_OUTPUT_DIR)) {
    mkdirSync(CLIPS_OUTPUT_DIR, { recursive: true });
  }
}

export function cutVerticalWithSubs(
  inputUrl: string,
  start: number,
  end: number,
  srtPath: string,
  outPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const safe = srtPath
      .replace(/:/g, "\\:")
      .replace(/,/g, "\\,")
      .replace(/'/g, "\\'");
    const vf = `scale=1080:-2,setsar=1:1,crop=1080:1920:(in_w-1080)/2:(in_h-1920)/2,subtitles='${safe}':force_style=Fontsize=28,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,BorderStyle=3,Outline=2`;
    const args = [
      "-y",
      "-ss",
      String(start),
      "-to",
      String(end),
      "-i",
      inputUrl,
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outPath,
    ];
    const cmd = getFfmpegPath();
    const p = spawn(cmd, args);
    p.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("ffmpeg failed"));
      }
    });
    p.on("error", reject);
  });
}
