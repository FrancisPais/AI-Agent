import { NextResponse } from "next/server";
import { TIKTOK_CLIENT_KEY, TIKTOK_REDIRECT_URI } from "@/lib/env";

export async function GET() {
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", TIKTOK_CLIENT_KEY);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "video.upload,video.publish");
  url.searchParams.set("redirect_uri", TIKTOK_REDIRECT_URI);
  url.searchParams.set("state", "dev");
  return NextResponse.redirect(url.toString());
}
