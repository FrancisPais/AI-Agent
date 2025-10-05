import { Queue, QueueOptions } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
})

const queueOptions: QueueOptions = {
  connection
}

export const videoQueue = new Queue('video.process', queueOptions)

export { connection }
