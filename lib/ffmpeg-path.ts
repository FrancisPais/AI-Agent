import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

function candidates(): string[] {
  const list: string[] = [];
  if (process.env.FFMPEG_PATH && process.env.FFMPEG_PATH.length > 0) {
    list.push(process.env.FFMPEG_PATH);
  }
  const home = process.env.USERPROFILE || homedir();
  list.push(join(home, "Desktop", "ffmpeg", "bin", "ffmpeg.exe"));
  list.push("ffmpeg");
  return list;
}

export function getFfmpegPath(): string {
  for (const p of candidates()) {
    if (p === "ffmpeg") {
      return p;
    }
    if (existsSync(p)) {
      return p;
    }
  }
  return "ffmpeg";
}
