"use client";

import { useState } from "react";

export default function Home() {
  const [channelUrl, setChannelUrl] = useState("");
  const [uploadsId, setUploadsId] = useState<string | null>(null);
  const [videos, setVideos] = useState<{ videoId: string; title: string }[]>(
    []
  );
  const [logs, setLogs] = useState<string[]>([]);

  async function addChannel() {
    const res = await fetch("/api/add-channel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelUrl }),
    });
    const json = await res.json();
    setUploadsId(json.uploadsPlaylistId);
  }

  async function fetchLatest() {
    const res = await fetch("/api/list-latest?uploadsId=" + uploadsId);
    const json = await res.json();
    setVideos(json.videos);
  }

  async function process(videoId: string, title: string) {
    const res = await fetch("/api/process-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, title }),
    });
    const json = await res.json();
    setLogs((l) => [JSON.stringify(json), ...l]);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Short-Cutter MVP</h1>
      <div className="flex gap-2">
        <input
          value={channelUrl}
          onChange={(e) => setChannelUrl(e.target.value)}
          placeholder="YouTube channel URL"
          className="flex-1 px-3 py-2 rounded bg-neutral-900 border border-neutral-700"
        />
        <button onClick={addChannel} className="px-4 py-2 rounded bg-blue-600">
          Add
        </button>
      </div>
      {uploadsId && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-sm">Uploads playlist: {uploadsId}</div>
            <button
              onClick={fetchLatest}
              className="px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-sm"
            >
              Fetch latest
            </button>
          </div>
          <div className="space-y-2">
            {videos.map((v) => (
              <div
                key={v.videoId}
                className="flex items-center justify-between p-3 rounded bg-neutral-900 border border-neutral-800"
              >
                <div className="text-sm truncate max-w-[70%]">
                  {v.title} ({v.videoId})
                </div>
                <button
                  onClick={() => process(v.videoId, v.title)}
                  className="px-3 py-1 rounded bg-green-600 text-sm"
                >
                  Process
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-xl">Logs</h2>
        <div className="space-y-2">
          {logs.map((x, i) => (
            <pre
              key={i}
              className="text-xs whitespace-pre-wrap bg-neutral-900 p-3 rounded border border-neutral-800"
            >
              {x}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}
