import { NextRequest, NextResponse } from "next/server";
import { getChannelUploadsPlaylistId } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const channelUrl = String(body.channelUrl || "");
  if (!channelUrl) {
    return NextResponse.json({ error: "channelUrl required" }, { status: 400 });
  }
  const uploadsPlaylistId = await getChannelUploadsPlaylistId(channelUrl);
  return NextResponse.json({ uploadsPlaylistId });
}
