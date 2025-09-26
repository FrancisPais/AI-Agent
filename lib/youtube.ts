import { YOUTUBE_API_KEY } from "@/lib/env";

export async function getChannelUploadsPlaylistId(
  input: string
): Promise<string> {
  const channelId = await resolveChannelId(input);
  if (!channelId) {
    throw new Error("Invalid channel URL");
  }
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
  );
  const json = await res.json();
  const uploads = json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) {
    throw new Error("No uploads playlist");
  }
  return uploads;
}

export async function listLatestVideos(
  uploadsPlaylistId: string,
  maxResults = 5
) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
  );
  const json = await res.json();
  return (json.items || []).map((it: any) => ({
    videoId: it.contentDetails.videoId as string,
    title: it.snippet.title as string,
  }));
}

export function extractChannelId(urlOrId: string): string | null {
  try {
    if (/^UC[A-Za-z0-9_-]{22}$/.test(urlOrId)) {
      return urlOrId;
    }
    const u = new URL(urlOrId);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/channel/")) {
        const id = u.pathname.split("/")[2];
        if (id) {
          return id;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveChannelId(input: string): Promise<string | null> {
  const direct = extractChannelId(input);
  if (direct) {
    return direct;
  }
  const handle = extractHandle(input);
  if (handle) {
    const id = await channelIdFromHandle(handle);
    if (id) {
      return id;
    }
  }
  const videoId = extractVideoId(input);
  if (videoId) {
    const id = await channelIdFromVideo(videoId);
    if (id) {
      return id;
    }
  }
  return null;
}

function extractHandle(input: string): string | null {
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/@")) {
        const h = u.pathname.slice(2).split("/")[0];
        if (h) {
          return h.toLowerCase();
        }
      }
      if (u.pathname.startsWith("/c/")) {
        const h = u.pathname.split("/")[2];
        if (h) {
          return h.toLowerCase();
        }
      }
      if (u.pathname.startsWith("/user/")) {
        const h = u.pathname.split("/")[2];
        if (h) {
          return h.toLowerCase();
        }
      }
    }
    return null;
  } catch {
    if (input.startsWith("@")) {
      const h = input.slice(1);
      if (h) {
        return h.toLowerCase();
      }
    }
    return null;
  }
}

function extractVideoId(input: string): string | null {
  try {
    const u = new URL(input);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.split("/")[1];
      if (id) {
        return id;
      }
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) {
        return id;
      }
      const parts = u.pathname.split("/");
      const idx = parts.indexOf("shorts");
      if (idx >= 0 && parts[idx + 1]) {
        return parts[idx + 1];
      }
      if (u.pathname.startsWith("/live/")) {
        const id2 = parts[2];
        if (id2) {
          return id2;
        }
      }
    }
    return null;
  } catch {
    if (/^[A-Za-z0-9_-]{11}$/.test(input)) {
      return input;
    }
    return null;
  }
}

async function channelIdFromVideo(videoId: string): Promise<string | null> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  const json = await res.json();
  const channelId = json.items?.[0]?.snippet?.channelId;
  if (typeof channelId === "string" && channelId.length > 0) {
    return channelId;
  }
  return null;
}

async function channelIdFromHandle(handle: string): Promise<string | null> {
  const q = handle.startsWith("@") ? handle : `@${handle}`;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
      q
    )}&maxResults=5&key=${YOUTUBE_API_KEY}`
  );
  const json = await res.json();
  const items: any[] = json.items || [];
  let candidate: string | null = null;
  for (const it of items) {
    const id = it?.snippet?.channelId;
    const customUrl = it?.snippet?.customUrl;
    if (customUrl && customUrl.toLowerCase() === q.toLowerCase()) {
      return id || null;
    }
    if (!candidate && id) {
      candidate = id;
    }
  }
  return candidate;
}
