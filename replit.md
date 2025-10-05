# YT Shortsmith

## Overview

YT Shortsmith is an AI-powered service that automatically generates short-form video clips from YouTube videos. It accepts a YouTube URL, downloads the source video, transcribes the audio, detects optimal segments for short-form content (20-60 seconds), converts them to 9:16 vertical format, adds subtitles, and scores each clip using AI criteria. The system is designed for creating engaging social media shorts optimized for platforms like TikTok, Instagram Reels, and YouTube Shorts.

## User Preferences

Preferred communication style: Simple, everyday language.

Code style constraints:
- Never add comments to code
- Always put single if conditions inside brackets with line breaks
- Focus on clean, self-documenting code

## Per-User Authentication System

**OAuth 2.0 Flow**:
- Users sign in with Google OAuth (youtube.readonly, email, profile scopes)
- OAuth tokens stored encrypted in database per user
- Automatic token refresh for expired credentials

**Cookie Management**:
- Each user uploads their YouTube cookies in Netscape format
- Cookies stored encrypted in database (AES-256-GCM)
- Cookies validated for required fields (SAPISID, HSID, SSID)
- Materialized to temp files with chmod 600 during yt-dlp operations
- Temp files deleted immediately after use
- Last used timestamp tracked per user

**Video Processing**:
- Videos linked to user accounts
- Worker fetches user cookies for each job
- Fails fast if user cookies not configured
- Secure temp file handling with automatic cleanup

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14 with App Router
- Server-side rendering and API routes integrated in a single application
- TypeScript for type safety
- TailwindCSS for styling with dark theme (gray-900 background)
- Client-side state management using React hooks
- API communication via fetch with RESTful endpoints

**Routing Structure**:
- `/` - Main dashboard listing all videos
- `/videos/[id]` - Video detail page with generated clips
- `/api/submit` - Accepts YouTube URLs and creates processing jobs
- `/api/videos` - Lists videos with pagination and search
- `/api/videos/[id]` - Returns video details with clips

**Design Pattern**: The frontend uses client-side components ('use client') that communicate with Next.js API routes, which in turn interact with the backend services. No authentication is implemented.

### Backend Architecture

**Core Framework**: Node.js 20 with TypeScript

**API Layer**: Next.js API routes under `/app/api` serving as REST endpoints

**Worker Pattern**: Separate worker process (`src/worker.ts`) that processes video jobs asynchronously using BullMQ. The worker is run independently via `npm run worker` and handles the heavy video processing tasks.

**Service Layer Architecture**:
- `youtube.ts` - Handles video metadata extraction and downloading via yt-dlp/youtube-dl
- `ffmpeg.ts` - Video processing (audio extraction, scene detection, vertical clip rendering, subtitle burning)
- `openai.ts` - Whisper transcription and GPT-based clip scoring/categorization
- `segmentation.ts` - Intelligent segment detection combining pause detection, scene changes, and duration constraints
- `s3.ts` - File uploads to S3-compatible storage
- `queue.ts` - BullMQ queue configuration with Redis connection
- `prisma.ts` - Database client singleton

**Processing Pipeline**:
1. User submits YouTube URL → API creates video record → Job enqueued
2. Worker picks up job → Downloads video with yt-dlp → Saves to temp directory
3. Extract audio → Transcribe with Whisper API (word-level timestamps)
4. Detect segments using:
   - Voice activity and pause gaps (0.35-0.9s gaps between words)
   - Scene changes from ffmpeg (threshold > 0.3)
   - Duration constraints (20-60 seconds, preferring 25-45 seconds)
   - Hook quality (first 3 seconds of speech)
5. For each segment:
   - Convert to 9:16 vertical format with smart cropping
   - Burn subtitles from transcript
   - Generate and overlay hook text
   - Extract thumbnail
   - Create SRT file
   - Upload all assets to S3
6. Score clips with AI rubric (hook, retention, clarity, shareability)
7. Store clip metadata in database

**Data Models** (Prisma):
- `Video` - Source video metadata (title, URL, duration, status)
- `Clip` - Generated short clips with scores, categories, S3 keys, and timing information

### External Dependencies

**Database**: 
- PostgreSQL via Prisma ORM
- Schema managed through Prisma migrations
- Connection via DATABASE_URL environment variable

**Queue System**:
- Redis for BullMQ job queue
- Handles asynchronous video processing jobs
- Connection via REDIS_URL environment variable

**AI Services** (OpenAI):
- Whisper API for audio transcription with word-level timestamps
- GPT-4o (or better) for clip categorization and scoring
- Requires OPENAI_API_KEY environment variable

**Video Processing**:
- ffmpeg via fluent-ffmpeg library for video manipulation
- ffmpeg-static provides bundled ffmpeg binary
- yt-dlp (or youtube-dl fallback) for downloading YouTube videos
- Configurable via YT_DLP_PATH environment variable
- High-quality encoding: CRF 18, preset medium, H.264 high profile level 4.2
- Audio chunking: Automatically splits files >20MB into 10-minute segments for Whisper API

**Object Storage** (S3-compatible):
- AWS SDK v3 (@aws-sdk/client-s3, @aws-sdk/s3-request-presigner)
- Supports AWS S3, Cloudflare R2, or any S3-compatible service
- Stores rendered clips, thumbnails, and SRT subtitle files
- Uses pre-signed URLs (2-hour expiration) for secure, time-limited access
- Uploads use ContentDisposition: inline for browser streaming
- Configuration via S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET
- CORS must be configured on bucket to allow GET/HEAD from Replit domains

**Required Environment Variables**:
```
OPENAI_API_KEY
REDIS_URL
DATABASE_URL
S3_ENDPOINT
S3_REGION
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_BUCKET
GOOGLE_CLIENT_ID (for OAuth 2.0)
GOOGLE_CLIENT_SECRET (for OAuth 2.0)
GOOGLE_REDIRECT_URI (optional, auto-detected from REPLIT_DOMAINS)
YT_DLP_PATH (optional, defaults to system PATH)
```

**Deployment Considerations**:
- Next.js app runs on port 5000 (configurable)
- Worker process runs separately and must be started independently
- ESLint disabled during builds for faster deployment
- Server actions body size limit set to 2MB
- TypeScript strict mode enabled