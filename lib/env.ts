import "dotenv/config";


export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
export const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:3000";
export const CLIPS_OUTPUT_DIR = process.env.CLIPS_OUTPUT_DIR || "./out";
export const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
export const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";
export const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const FORCE_ASR = process.env.FORCE_ASR || "";