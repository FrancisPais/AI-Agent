import IORedis from "ioredis";
import { REDIS_URL } from "@/lib/env";

export const redis = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
