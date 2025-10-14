# YT Shortsmith

## Overview
YT Shortsmith is an AI-powered service that automates the creation of engaging short-form video clips from YouTube videos. It handles downloading, transcribing, intelligently segmenting, and formatting videos into 20-60 second vertical clips optimized for social media platforms like TikTok, Instagram Reels, and YouTube Shorts. The project aims to streamline content repurposing for creators, enabling them to transform long-form content into high-impact social media assets efficiently.

## User Preferences
Preferred communication style: Simple, everyday language.

Code style constraints:
- Never add comments to code
- Always put single if conditions inside brackets with line breaks
- Focus on clean, self-documenting code

## System Architecture

### Frontend
The frontend uses Next.js 14 (App Router), TypeScript, and TailwindCSS for a modern, responsive user interface with server-side rendering. It includes a dashboard and video detail pages.

### Backend
The backend, built with Node.js 20 and TypeScript, utilizes a Next.js API layer for REST endpoints and a BullMQ-powered worker process (`src/worker.ts`) for asynchronous video processing.

**Core Processing Pipeline:**
1.  **Job Creation**: User submits YouTube URL, triggering video record creation and job enqueuing.
2.  **Video Ingestion**: Downloads video metadata and the video itself via `yt-dlp`.
3.  **Audio Processing**: Extracts, compresses, and transcribes audio using Whisper API with word-level timestamps.
4.  **Intelligent Segmentation**: Segments videos into 20-60 second clips (preferring 25-45s) based on voice activity, pauses, and scene changes, with AI scoring to remove overlapping or lower-quality segments.
5.  **Clip Generation**: Converts selected segments to 9:16 vertical format, applies smart cropping, adds burned-in subtitles, hook text overlay, and generates a thumbnail. Assets are uploaded to S3.
6.  **Smart Framing (Optional)**: Uses face detection and speaker timelines to generate dynamic crop keyframes for smooth panning.
7.  **AI Scoring**: GPT-4o scores clips based on a rubric (hook, retention, clarity, shareability), generating categories, tags, and rationale.
8.  **Data Storage**: Stores clip metadata, scores, S3 keys, and crop maps in the database.

**Data Models (Prisma):**
-   `User`: Authentication and user-specific data.
-   `Video`: Source YouTube video metadata.
-   `Clip`: Generated short video clips and their associated data.
-   `TikTokConnection`: User TikTok OAuth tokens.

**Core Services:**
-   **`framingService.ts`**: Manages smart framing, including TensorFlow.js for face detection and keyframe generation.
-   **`ffmpeg.ts`**: Handles all video/audio processing tasks (rendering, audio extraction, thumbnail generation, scene detection).
-   **`youtube.ts`**: Manages `yt-dlp` operations for YouTube video interaction (downloading, metadata).
-   **`segmentation.ts`**: Implements intelligent clip segmentation logic and scoring.
-   **`openai.ts`**: Integrates OpenAI APIs for Whisper transcription and GPT-4o clip scoring.
-   **`s3.ts`**: Provides S3 object storage functionalities.
-   **`queue.ts`**: Configures BullMQ for job orchestration.

### UI/UX Decisions
The application uses Next.js with TailwindCSS to provide a modern, dark-themed interface, offering a consistent and visually appealing user experience.

### System Design Choices
-   **Asynchronous Processing**: Utilizes BullMQ and Redis for robust, scalable background job processing.
-   **Modular Architecture**: Services are clearly separated (e.g., `ffmpeg`, `youtube`, `openai`) for maintainability.
-   **Prisma ORM**: Simplifies database interactions and schema management.
-   **Smart Framing**: Incorporates advanced computer vision and AI for dynamic, engaging video framing.

## External Dependencies

**Database:**
-   **PostgreSQL**: Primary data store, managed by Prisma ORM.

**Queue System:**
-   **Redis**: Used by BullMQ for managing asynchronous job queues.

**AI Services:**
-   **OpenAI Whisper API**: For highly accurate audio transcription.
-   **GPT-4o**: Utilized for intelligent clip scoring, categorization, and rationale generation.

**Video Processing Libraries:**
-   **ffmpeg**: The core video and audio manipulation tool, integrated via `fluent-ffmpeg` and `ffmpeg-static`.
-   **yt-dlp**: For downloading YouTube videos and extracting metadata.

**Object Storage:**
-   **S3-compatible storage**: Used for storing generated video clips, thumbnails, and SRT files (AWS SDK v3).

**Face Detection & AI Models:**
-   **@vladmandic/face-api**: For face detection (SSD MobileNet v1) in smart framing.
-   **@tensorflow/tfjs-node**: TensorFlow backend supporting AI models for face detection.

## Recent Enhancements

### Segmentation V2 System (October 14, 2025)
Complete rewrite of clip detection with TikTok-optimized algorithms (`src/services/segmentation-v2.ts`):

**Multi-Factor Scoring** (weighted blend):
- Hook strength: 28% - Detects questions, bold claims, "How to", "X vs Y", numbers
- Retention likelihood: 18% - Speech rate, pause density, Q→A arcs, scene changes (2-4 ideal)
- Clarity: 16% - Filler word ratio, coherent message flow
- Visual quality: 12% - Scene change density, stable framing
- Novelty: 10% - Topic freshness (placeholder for embedding distance)
- Engagement signals: 10% - Audience attention proxies (comment hotspots planned for future)
- Safety: 6% - Profanity/brand risk detection

**Adaptive Duration Selection**:
- Short (30s): Standard clips with good hook
- Mid (45s): High retention (>0.7) + good hook (>0.6)
- Long (60s): Exceptional hook (>0.8) + exceptional retention (>0.8)
- Auto-adjusts for clarity: poor clarity (<0.5) caps at 35s

**Hook Detection Patterns**:
- Questions: "How", "What", "Why", "Can", "Will", etc.
- Bold claims: "This is", "The best", "Never", "Always", "Secret", "Truth"
- Controversy: "vs.", "versus", "compared to"
- Numbers and statistics

**Speech Dynamics Analysis** (first 5 seconds):
- Speech rate: words per second
- Pause density: silence ratio
- Energy level: caps, punctuation, long words

**Chapter-Bounded Sweeps**:
- Adaptive step size: max(45s, 10% of chapter length)
- Windows: 75s candidate zones
- Smart intro skip with multilingual detection

**Quality Guards**:
- Minimum 3 words in first 3 seconds
- Safety score ≥0.5 (profanity filter)
- Clarity score ≥0.3 (filler word threshold)

**Diversity Filter**:
- Text similarity threshold: 0.7
- Prevents near-duplicate clips
- Jaccard index on word sets

**Explainable Rationale**:
- Stores top 3 ranking factors per clip
- Examples: "strong hook, high retention potential, good visual pacing"

**New Database Fields**:
- `Clip.rationaleShort`: Human-readable ranking explanation
- `Clip.featuresJson`: Full feature vector for analysis
- `Clip.durationChoice`: "short30" | "mid45" | "long60"

**Enhanced GPT-4o Scoring**:
Updated prompt with TikTok-specific criteria: first 2 seconds are critical, must work with sound OFF, clarity over complexity, shareability focus.

### Body-Aware Smart Framing (October 14, 2025)
Enhanced face detection to estimate full body structure for natural composition:
- Head height calculation from eyebrow to chin landmarks
- Shoulder width estimation from jawline corners
- Torso projection (2.7× head height, configurable via `FRAMING_TORSO_MULTIPLIER`)
- Centers crop on body centroid (40% down body height) instead of face only
- Graceful fallback to face-only mode if landmarks unavailable
- Works with existing 68-point landmarks, no new ML models required

### Universal Language Detection (October 13, 2025)
- Whisper API automatically detects and transcribes in source language
- Portuguese videos → Portuguese subtitles, English videos → English subtitles, etc.
- Detected language stored in transcript metadata for downstream AI processing

### Chapter-Based Intro Skipping (October 13, 2025)
Smart intro detection using YouTube chapter metadata with 3-tier logic:
- If chapters exist + first chapter IS intro → skip only that chapter
- If chapters exist + first chapter is NOT intro → process from start (no skip)
- If no chapters exist → fallback to 180-second skip
- Multilingual intro keywords in 10 languages (EN, ES, PT, FR, DE, IT, JA, KO, ZH, RU)

### TikTok Publishing Integration (October 14, 2025)
OAuth-based TikTok publishing with secure token management:
- **Token Encryption**: All OAuth tokens stored encrypted in database using AES-256-GCM
- **Automatic Refresh**: Worker decrypts tokens, refreshes if needed, re-encrypts updated tokens
- **Scope Support**: Supports both draft (`self_only`) and publish (`public`) modes
- **Custom Metadata**: Optional `tiktokTitle` and `tiktokDescription` fields for custom post content
- **Smart Caption Building**: Falls back to `[hook] · [video title] #tags` if no custom metadata (200 char limit)
- **Real-time Status**: UI polls worker status every 2 seconds for live feedback
- **Worker Integration**: TikTok worker runs alongside main video processing worker

**Required TikTok Scopes**:
- `video.publish` or `video.upload` - For posting videos (draft requires only `video.upload`)
- `user.info.basic` - For user identification

### YouTube Comment Hotspot Mining (October 14, 2025)
Engagement-driven clip selection using YouTube comment timestamp analysis:
- **API Integration**: YouTube Data API v3 fetches top 100 comments ordered by relevance
- **Timestamp Extraction**: Regex parses mm:ss and hh:mm:ss timestamps from comment text
- **Hotspot Clustering**: Groups timestamps within 30-second windows, uses median as peak
- **Engagement Scoring**: Segments near hotspots (±30s) boost engagement score to 0.8 (vs 0.4 default)
- **Graceful Fallback**: Comments disabled/unavailable → empty array stored, defaults to 0.4 engagement
- **Duration Unlock**: High engagement (>0.75) + good hook (>0.7) enables 60-second clips
- **Database Storage**: Hotspots stored in `Video.commentTimestampHotspotsJson` as array of seconds

**Product Behavior**:
- Videos with comments off/empty: peaks = [], engagement prior = 0, blend falls back to retention or 0.4
- Chapters still guide search, but comment peaks boost selections overlapping crowd's favorite moments
- Adaptive duration: 30s default, 45s for high retention + good hook, 60s for exceptional hook + retention OR high engagement + good hook