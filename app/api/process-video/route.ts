import { NextRequest, NextResponse } from "next/server";
import { clipQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const videoId = String(body.videoId || "");
  const title = String(body.title || "");
  if (!videoId) {
    return NextResponse.json({ error: "videoId required" }, { status: 400 });
  }
  const job = await clipQueue.add("clip", { videoId, title });
  return NextResponse.json({ enqueued: true, id: job.id });
}
