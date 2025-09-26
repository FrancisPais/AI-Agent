import { NextRequest, NextResponse } from "next/server";
import { listLatestVideos } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const uploadsId = String(
    new URL(req.url).searchParams.get("uploadsId") || ""
  );
  if (!uploadsId) {
    return NextResponse.json({ error: "uploadsId required" }, { status: 400 });
  }
  const videos = await listLatestVideos(uploadsId, 5);
  return NextResponse.json({ videos });
}
