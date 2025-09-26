type TranscriptItem = { text: string; offset: number; duration: number };

export function selectHighlightWindows(
  items: TranscriptItem[],
  targetSeconds = 30,
  stride = 5,
  topK = 2
) {
  const scores: { start: number; end: number; score: number }[] = [];
  let i = 0;
  while (i < items.length) {
    const startTime = items[i].offset;
    let j = i;
    let accum = 0;
    let text = "";
    while (j < items.length && accum < targetSeconds) {
      accum += items[j].duration;
      text += items[j].text + " ";
      j++;
    }
    const score = scoreText(text);
    const endTime = startTime + accum;
    scores.push({ start: startTime, end: endTime, score });
    i += Math.max(1, Math.floor(stride / Math.max(1, items[i].duration)));
  }
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topK);
}

function scoreText(t: string) {
  const hooks = [
    "how to",
    "secret",
    "mistake",
    "tip",
    "trick",
    "why",
    "truth",
    "avoid",
    "do this",
    "bad",
    "good",
    "best",
    "worst",
    "top",
    "hack",
    "lesson",
    "story",
    "data",
    "results",
  ];
  const lowered = t.toLowerCase();
  let s = 0;
  for (const h of hooks) {
    if (lowered.includes(h)) {
      s += 3;
    }
  }
  s += Math.min(5, Math.floor(t.split(/\s+/).length / 20));
  return s;
}
