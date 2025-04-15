import { Workflow, Node } from "../models/workflow";
import { NodeProgress } from "../models/workflow-state";
import { saveWorkflow, getWorkflow as getWorkflowFromStore, deleteWorkflowFromStore, getAllWorkflowIds as getAllWorkflowIdsFromStore } from "../store/data-store";
import { workflowQueue } from "../queues/task-queue";
import logger from "../utils/logger";
import { updateJobStatus } from "../queues/task-queue";
import { getRedisClient } from "../lib/redis";

// validate NodeType
const isValidNode = (node: Node): boolean => {
  return ["start", "http", "function"].includes(node.type);
};

// create new Workflow
export const createWorkflow = async (workflowData: Workflow): Promise<Workflow> => {
  const { id, name, nodes } = workflowData;

  if (!id || !name || !nodes || !Array.isArray(nodes) || nodes.length < 2) {
    throw new Error("Invalid workflow structure");
  }

  if (!nodes.every(isValidNode)) {
    throw new Error("Invalid node types in worklfow ");
  }

  await saveWorkflow(id, workflowData);
  logger.info(`Workflow ${id} created successfully`);
  return workflowData;
};

// Retrieve a Workflow by ID
export const getWorkflow = async (id: string): Promise<Workflow> => {
  const workflow = await getWorkflowFromStore(id);
  console.log("workflow", workflow);
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  return workflow;
};

// update an existing Worflow
export const updateWorkflow = async (
  id: string,
  updateWorkflowData: Workflow
): Promise<Workflow> => {
  const existingWorkflow = await getWorkflowFromStore(id);
  
  if (!existingWorkflow) {
    throw new Error("Workflow not found");
  }

  if (!updateWorkflowData.nodes.every(isValidNode)) {
    throw new Error("Invalid node types in workflow");
  }

  await saveWorkflow(id, updateWorkflowData);
  return updateWorkflowData;
};

// delete a Workflow
export const deleteWorkflow = async (id: string) => {
  const existingWorkflow = await getWorkflowFromStore(id);
  
  if (!existingWorkflow) {
    throw new Error("Workflow not found");
  }
  
  await deleteWorkflowFromStore(id);
  logger.info(`Workflow ${id} deleted successfully`);
};

// get all Workflow IDs
export const getAllWorkflowIds = async () => {
  try {
    const workflowIds = await getAllWorkflowIdsFromStore();
    
    if (workflowIds.length === 0) {
      logger.info("No workflows found.");
    } else {
      logger.info(`Fetched ${workflowIds.length} workflow IDs`);
    }
    
    return workflowIds;
  } catch (error) {
    logger.error(`Error in fetching workflow IDs: ${error}`);
    throw error;
  }
};

// execute a Workflow
// This function adds a workflow to the queue and updates its status
export const executeWorkflow = async (workflowId: string) => {
  try {
    const workflow = await getWorkflowFromStore(workflowId);

    if (!workflow) {
      throw new Error(`WorkflowID: ${workflowId} not found`);
    }

    const job = await workflowQueue.add('workflow', { workflow });
    await updateJobStatus(job.id || '', "pending");
    logger.info(`Workflow ${workflowId} added to queue with JobID: ${job.id}`);
    return job.id;
  } catch (error) {
    logger.error(`Failed to enqueue workflow ${workflowId}: ${error}`);
    throw error;
  }
};

// get Workflow Status
// This function retrieves the status of a workflow by its job ID
export const getWorkflowStatus = async (jobId: string) => {
  try {   
    logger.info(`Fetching getWorkflowStatus for job ID: ${jobId}`);
    const redisClient = await getRedisClient();
    const [jobStatus, rawProgress] = await Promise.all([
      redisClient.get(`job:${jobId}:status`),
      redisClient.hGetAll(`job:${jobId}:nodeProgress`),
    ]);

    if (!jobStatus || !rawProgress || Object.keys(rawProgress).length === 0) {       
      return null;
    }

    const nodesStatus: Record<string, NodeProgress> = {};
    for (const [nodeId, json] of Object.entries(rawProgress)) {       
      const fullProgress = JSON.parse(json);     
      const { errorMessage, ...rest } = fullProgress;       

      nodesStatus[nodeId] = {
        ...rest,
        ...(errorMessage && {
          errorMessage:
            typeof errorMessage === "object" && errorMessage.message
              ? errorMessage.message
              : String(errorMessage),
        }),
      };
    }

    return { jobId, jobStatus, nodesStatus };

  } catch (error) {
    throw error;
  }
};
