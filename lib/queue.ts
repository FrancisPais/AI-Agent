import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export type ClipJobData = {
  videoId: string;
  title: string;
};

export const clipQueue = new Queue<ClipJobData>("clip-jobs", {
  connection: redis,
});
