import { Queue, Worker, QueueEvents } from 'bullmq';
import { CONFIG } from "../config/config";
import logger from "../utils/logger";
import { getRedisClient } from "../lib/redis";

// Define Workflow Queue
export const workflowQueue = new Queue("workflowQueue", {
  connection: { host: CONFIG.REDIS.HOST, port: CONFIG.REDIS.PORT }
});

// Create QueueEvents instance
const queueEvents = new QueueEvents("workflowQueue", {
  connection: { host: CONFIG.REDIS.HOST, port: CONFIG.REDIS.PORT }
});

// Log job events and store status in Redis
queueEvents.on('waiting', async ({ jobId }) => {
  logger.info(`Job waiting: ${jobId}`);
  await updateJobStatus(jobId, "pending");
});

queueEvents.on('active', async ({ jobId, prev }) => {
  logger.info(`Job started: ${jobId}`);
  await updateJobStatus(jobId, "in_progress");
});

queueEvents.on('completed', async ({ jobId, returnvalue }) => {
  logger.info(`Job completed: ${jobId}`);
  await updateJobStatus(jobId, "completed");
});

queueEvents.on('failed', async ({ jobId, failedReason }) => {
  logger.error(`Job failed: ${jobId}, Error: ${failedReason}`);
  await updateJobStatus(jobId, "failed");
});

// Store JobStatus in Redis
export const updateJobStatus = async (jobId: string, status: string) => {
  const redisClient = await getRedisClient();
  await redisClient.set(`job:${jobId}:status`, status);
};
