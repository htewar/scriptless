import { Workflow } from "../models/workflow";
import { getRedisClient } from "../lib/redis";
import logger from "../utils/logger";

export interface User {
    username: string;
    password: string;
};

export const revokedTokens = new Set<string>();

export const revokeToken = (token: string) => {
    revokedTokens.add(token);
};

export const isTokenRevoked = (token: string): boolean => {
    return revokedTokens.has(token);
}

// hardcoded user credentials
const users: User[] = [
    { username: 'admin', password: 'admin' },
];

export const findUser = (username: string, password: string): User | null => {
    return users.find(user => user.username === username && user.password === password) || null;
}

// In-memory storage as fallback 
export const workflows = new Map<string, Workflow>();

// Redis-based workflow storage methods
export const saveWorkflow = async (id: string, workflow: Workflow): Promise<void> => {
    try {
        const redisClient = await getRedisClient();
        await redisClient.set(`workflow:${id}`, JSON.stringify(workflow));
        
        // Update in-memory cache as well
        workflows.set(id, workflow);
        
        logger.info(`Workflow ${id} saved to Redis`);
    } catch (error) {
        logger.error(`Failed to save workflow ${id} to Redis: ${error}`);
        // Fallback to in-memory only
        workflows.set(id, workflow);
    }
};

export const getWorkflow = async (id: string): Promise<Workflow | null> => {
    try {
        const redisClient = await getRedisClient();
        const workflowStr = await redisClient.get(`workflow:${id}`);
        
        if (workflowStr) {
            const workflow = JSON.parse(workflowStr) as Workflow;
            // Update in-memory cache
            workflows.set(id, workflow);
            return workflow;
        }
        
        // Check in-memory cache as fallback
        return workflows.get(id) || null;
    } catch (error) {
        logger.error(`Failed to get workflow ${id} from Redis: ${error}`);
        // Fallback to in-memory only
        return workflows.get(id) || null;
    }
};

export const deleteWorkflowFromStore = async (id: string): Promise<void> => {
    try {
        const redisClient = await getRedisClient();
        await redisClient.del(`workflow:${id}`);
        
        // Remove from in-memory cache as well
        workflows.delete(id);
        
        logger.info(`Workflow ${id} deleted from Redis`);
    } catch (error) {
        logger.error(`Failed to delete workflow ${id} from Redis: ${error}`);
        // Still remove from in-memory
        workflows.delete(id);
    }
};

export const getAllWorkflowIds = async (): Promise<string[]> => {
    try {
        const redisClient = await getRedisClient();
        const keys = await redisClient.keys('workflow:*');
        
        if (keys.length > 0) {
            return keys.map(key => key.replace('workflow:', ''));
        }
        
        // Fallback to in-memory
        return Array.from(workflows.keys());
    } catch (error) {
        logger.error(`Failed to get all workflow IDs from Redis: ${error}`);
        // Fallback to in-memory
        return Array.from(workflows.keys());
    }
};


