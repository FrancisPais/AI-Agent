import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/session";
import { ensureAccessToken } from "@/src/services/tiktok";
import { decrypt } from "@/src/lib/encryption";

function publicUrlForKey(key: string) {
  const base = process.env.PUBLIC_ASSETS_BASE_URL || "";
  if (base) {
    return `${base.replace(/\/$/, "")}/${key}`;
  }
  const endpoint = (process.env.S3_ENDPOINT || "").replace(/\/$/, "");
  const bucket = process.env.S3_BUCKET || "";
  if (endpoint && bucket) {
    return `${endpoint}/${bucket}/${key}`;
  }
  return "";
}

async function fetchTikTokStatus(accessToken: string, publishId: string) {
  const res = await fetch(
    "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ publish_id: publishId }),
    },
  );
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session.userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20")),
    );
    const sort = searchParams.get("sort") || "createdAt";
    const include = searchParams.get("include") || "";
    const includeClips = include
      .split(",")
      .map((s) => s.trim())
      .includes("clips");

    const where: any = { userId: session.userId };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" as const } },
        { sourceUrl: { contains: q, mode: "insensitive" as const } },
      ];
    }

    const orderBy =
      sort === "createdAt"
        ? { createdAt: "desc" as const }
        : { updatedAt: "desc" as const };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: includeClips
          ? {
              clips: {
                orderBy: { createdAt: "desc" },
                select: {
                  id: true,
                  startSec: true,
                  endSec: true,
                  durationSec: true,
                  scoreOverall: true,
                  s3VideoKey: true,
                  s3ThumbKey: true,
                  tiktokStatus: true,
                  tiktokPublishId: true,
                  createdAt: true,
                },
              },
              _count: { select: { clips: true } },
            }
          : {
              _count: { select: { clips: true } },
            },
      }),
      prisma.video.count({ where }),
    ]);

    let accessToken: string | null = null;

    if (includeClips) {
      const conn = await prisma.tikTokConnection.findFirst({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
      });

      if (conn) {
        const ensured = await ensureAccessToken({
          accessToken: decrypt(conn.accessToken),
          refreshToken: decrypt(conn.refreshToken),
          expiresAt: conn.expiresAt,
        });
        accessToken = ensured.accessToken;
      }
    }

    let shaped: any;

    if (includeClips) {
      shaped = [];
      for (const v of videos) {
        const clips = [];
        for (const c of v.clips) {
          let tiktokLiveStatus: any = null;
          if (accessToken && c.tiktokPublishId) {
            const st = await fetchTikTokStatus(accessToken, c.tiktokPublishId);
            tiktokLiveStatus = st;
          }
          clips.push({
            ...c,
            videoUrl: publicUrlForKey(c.s3VideoKey),
            thumbUrl: publicUrlForKey(c.s3ThumbKey),
            tiktokLiveStatus,
          });
        }
        shaped.push({ ...v, clips });
      }
    } else {
      shaped = videos;
    }

    return NextResponse.json({
      videos: shaped,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    if (error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
