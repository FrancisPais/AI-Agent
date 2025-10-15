# YT Shortsmith System Overview

## High-Level Flow
1. **Authenticated creators submit a YouTube URL.** The Next.js dashboard ensures the user has uploaded YouTube cookies and initiates `/api/submit` to enqueue processing. 【F:app/page.tsx†L1-L215】【F:app/api/submit/route.ts†L1-L92】
2. **BullMQ background workers orchestrate the clip pipeline.** Each queued video is processed end-to-end—from download through AI-driven scoring and S3 uploads—while guarding against user-triggered cancellations. 【F:src/lib/queue.ts†L1-L56】【F:src/worker.ts†L1-L229】
3. **Users review generated clips and trigger TikTok distribution.** The video detail page surfaces scoring metadata, filters, and TikTok publishing controls that call dedicated API routes. 【F:app/videos/[id]/page.tsx†L1-L200】

## Frontend Applications
- **Dashboard (`app/page.tsx`)**
  - Redirects unauthenticated users to `/login` and enforces cookie setup before video submission.
  - Presents submission form, status table, cancellation control, and TikTok connection state.
- **Video detail view (`app/videos/[id]/page.tsx`)**
  - Fetches clip metadata, displays scoring/segment info, and offers TikTok draft publishing with polling for job state.

## API & Server Logic
- **Video submission (`app/api/submit/route.ts`)**
  - Validates YouTube URLs, ensures session and cookie presence, persists the queued video, and adds a BullMQ job (`video.process`).
- **Prisma helpers (`src/lib/prisma.ts`) & sessions (`src/lib/session.ts`)**
  - Provide shared database and authentication utilities that API routes and workers consume.

## Background Processing Pipeline
Implemented in `src/worker.ts`, the pipeline performs:
1. **Metadata & download** – Uses yt-dlp with per-user cookies to fetch metadata, download the best available MP4, and verify bitrate thresholds. 【F:src/worker.ts†L41-L129】【F:src/services/youtube.ts†L1-L207】
2. **Transcription & scene understanding** – Extracts audio, compresses for Whisper transcription, saves transcripts to Prisma, and identifies scene changes. 【F:src/worker.ts†L130-L190】【F:src/services/ffmpeg.ts†L1-L200】【F:src/services/openai.ts†L1-L160】
3. **Segment selection** – Combines transcript, scene cuts, chapters, and engagement hotspots mined from comments to score candidate segments. 【F:src/worker.ts†L190-L266】【F:src/services/segmentation-v2.ts†L1-L220】【F:src/services/youtube-comments.ts†L1-L200】
4. **Clip rendering** – Generates subtitles, applies optional smart framing, renders vertical clips, extracts thumbnails, and uploads artifacts to S3. 【F:src/worker.ts†L214-L343】【F:src/services/framingService.ts†L1-L220】【F:src/services/ffmpeg.ts†L200-L400】【F:src/services/s3.ts†L1-L120】
5. **Scoring & persistence** – Calls OpenAI to score hooks/retention, saves metadata and crop maps, and marks job completion or failure. 【F:src/worker.ts†L266-L382】【F:src/services/openai.ts†L160-L320】

## Supporting Services
- **YouTube integration (`src/services/youtube.ts`)** – Manages yt-dlp discovery, download flows, cookie file encryption lifecycle, and chapter parsing.
- **TikTok worker (`src/worker-tiktok.ts`)** – Handles TikTok job queue consumption and interacts with TikTok API for publishing.
- **Rate limiting (`src/lib/rate-limit.ts`) & cleanup (`src/lib/cleanup.ts`)** – Provide shared infra for Express endpoints and temp file hygiene.

## Key Infrastructure
- **BullMQ queues** for long-running video and TikTok jobs backed by Redis. 【F:src/lib/queue.ts†L1-L56】
- **Prisma ORM** for persisting users, videos, clips, and TikTok status fields. 【F:src/lib/prisma.ts†L1-L18】
- **AWS S3 client** for storage of rendered media assets. 【F:src/services/s3.ts†L1-L120】

This document consolidates the moving pieces so you can dive into specific layers quickly when implementing new features or debugging pipeline stages.
