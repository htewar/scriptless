import { redisClient } from '../config/config';
import logger from '../utils/logger';

let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

export const ensureRedisConnection = async () => {
    if (redisClient.isReady) {
        return;
    }

    if (isConnecting && connectionPromise) {
        return connectionPromise;
    }

    isConnecting = true;
    connectionPromise = (async () => {
        try {
            await redisClient.connect();
            logger.info('Connected to Redis');
        } catch (error) {
            logger.error(`Error connecting to Redis: ${error}`);
            throw error;
        } finally {
            isConnecting = false;
            connectionPromise = null;
        }
    })();

    return connectionPromise;
};

// Handle Redis connection events
redisClient.on('error', (error: Error) => {
    logger.error(`Redis connection error: ${error}`);
});

redisClient.on('end', () => {
    logger.warn('Redis connection ended');
});

redisClient.on('reconnecting', () => {
    logger.info('Reconnecting to Redis...');
});

export const getRedisClient = async () => {
    await ensureRedisConnection();
    return redisClient;
}; 