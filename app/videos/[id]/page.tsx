"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Clip {
  id: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  category: string;
  tags: string[];
  scoreHook: number;
  scoreRetention: number;
  scoreClarity: number;
  scoreShare: number;
  scoreOverall: number;
  rationale: string;
  videoUrl: string;
  thumbUrl: string;
  srtUrl: string;
  tiktokStatus?: string | null;
}

interface Video {
  id: string;
  title: string;
  sourceUrl: string;
  status: string;
  durationSec: number;
  clips: Clip[];
}

export default function VideoDetail() {
  const params = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [tiktokStatus, setTiktokStatus] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idParam = (params as any)?.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (id) {
      fetchVideo(id);
    }
  }, [params]);

  async function fetchVideo(id: string) {
    setError(null);
    try {
      const response = await fetch(`/api/videos/${id}`);
      const data = await response.json();
      if (response.ok) {
        setVideo(data);
        const initialStatus: Record<string, string> = {};
        data.clips?.forEach((clip: Clip) => {
          if (clip.tiktokStatus) {
            initialStatus[clip.id] = clip.tiktokStatus;
          }
        });
        setTiktokStatus(initialStatus);
      }
    } catch (e) {
      setError("Error fetching video");
    } finally {
      setLoading(false);
    }
  }

  async function sendToTikTok(clipId: string) {
    setError(null);
    setSending((prev) => ({ ...prev, [clipId]: true }));
    try {
      const response = await fetch(`/api/tiktok/clip/${clipId}/post`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "draft" }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data && data.error) {
          setError(data.error);
        } else {
          setError("Failed to send to TikTok");
        }
        setSending((prev) => ({ ...prev, [clipId]: false }));
        setTiktokStatus((prev) => ({ ...prev, [clipId]: "failed" }));
        return;
      }
      const pollStatus = async () => {
        const statusRes = await fetch(`/api/tiktok/clip/${clipId}/status`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          if (data.tiktokStatus) {
            setTiktokStatus((prev) => ({ ...prev, [clipId]: data.tiktokStatus }));
            if (data.tiktokStatus === "draft" || data.tiktokStatus === "published" || data.tiktokStatus === "failed") {
              setSending((prev) => ({ ...prev, [clipId]: false }));
              return;
            }
          }
        }
        setTimeout(pollStatus, 2000);
      };
      pollStatus();
    } catch (e) {
      setError("Failed to send to TikTok");
      setSending((prev) => ({ ...prev, [clipId]: false }));
      setTiktokStatus((prev) => ({ ...prev, [clipId]: "failed" }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Video not found</div>
        </div>
      </div>
    );
  }

  const categories = [
    "all",
    ...Array.from(new Set(video.clips.map((c) => c.category))),
  ];

  const filteredClips = video.clips.filter((clip) => {
    if (selectedCategory !== "all" && clip.category !== selectedCategory) {
      return false;
    }
    if (clip.scoreOverall < minScore) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          ← Back to Videos
        </Link>

        <div className="bg-gray-800 p-6 rounded-lg mb-4">
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>
              Status:{" "}
              <span
                className={`${
                  video.status === "completed"
                    ? "text-green-500"
                    : video.status === "processing"
                      ? "text-blue-500"
                      : video.status === "failed"
                        ? "text-red-500"
                        : "text-gray-500"
                }`}
              >
                {video.status}
              </span>
            </span>
            <span>Duration: {Math.floor(video.durationSec / 60)}m</span>
            <span>Clips: {video.clips.length}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 p-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700 rounded border border-gray-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">
                Min Score: {minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-48"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClips.map((clip) => (
            <div
              key={clip.id}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="relative pb-[177.77%]">
                <video
                  src={clip.videoUrl}
                  poster={clip.thumbUrl}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-1 bg-blue-600 rounded text-xs">
                    {clip.category}
                  </span>
                  <span className="text-2xl font-bold text-green-400">
                    {clip.scoreOverall}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {clip.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  <div>Hook: {clip.scoreHook}/10</div>
                  <div>Retention: {clip.scoreRetention}/10</div>
                  <div>Clarity: {clip.scoreClarity}/10</div>
                  <div>Shareability: {clip.scoreShare}/10</div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{clip.rationale}</p>
                <div className="text-xs text-gray-500 mb-3">
                  {Math.floor(clip.startSec)}s - {Math.floor(clip.endSec)}s (
                  {clip.durationSec}s)
                </div>
                <div className="flex gap-2">
                  <a
                    href={clip.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Video
                  </a>
                  <a
                    href={clip.srtUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    SRT
                  </a>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => sendToTikTok(clip.id)}
                    disabled={!!sending[clip.id] || tiktokStatus[clip.id] === "draft" || tiktokStatus[clip.id] === "published"}
                    className={`flex-1 text-center px-3 py-2 rounded text-sm transition ${
                      tiktokStatus[clip.id] === "draft" || tiktokStatus[clip.id] === "published"
                        ? "bg-green-700 cursor-default"
                        : tiktokStatus[clip.id] === "failed"
                          ? "bg-red-700 cursor-default"
                          : sending[clip.id]
                            ? "bg-gray-700 cursor-wait"
                            : "bg-pink-600 hover:bg-pink-700"
                    }`}
                  >
                    {tiktokStatus[clip.id] === "draft"
                      ? "Sent as Draft ✓"
                      : tiktokStatus[clip.id] === "published"
                        ? "Published ✓"
                        : tiktokStatus[clip.id] === "failed"
                          ? "Failed"
                          : sending[clip.id]
                            ? "Sending to TikTok…"
                            : "Send to TikTok"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredClips.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No clips match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
