import { writeFileSync } from "node:fs";

type TranscriptItem = { text: string; offset: number; duration: number };

function toTimestamp(sec: number) {
  const ms = Math.floor(sec * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const mm = String(ms % 1000).padStart(3, "0");
  return `${h}:${m}:${s},${mm}`;
}

export function writeSrtForWindow(
  items: TranscriptItem[],
  start: number,
  end: number,
  outPath: string
) {
  let idx = 1;
  const parts: string[] = [];
  for (const it of items) {
    const a = it.offset;
    const b = it.offset + it.duration;
    if (a < end && b > start) {
      const sa = Math.max(a, start);
      const sb = Math.min(b, end);
      const line = `${idx}\n${toTimestamp(sa - start)} --> ${toTimestamp(
        sb - start
      )}\n${it.text}\n\n`;
      parts.push(line);
      idx++;
    }
  }
  const srt = parts.join("");
  writeFileSync(outPath, srt);
}
