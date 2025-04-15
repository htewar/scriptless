import { Request, Response, NextFunction, RequestHandler } from "express";
import * as WorkflowService from "../services/workflow-service";
import logger from "../utils/logger";
import { redisClient } from "../config/config";
import { NodeProgress } from "../models/workflow-state";
import { NextRequest, NextResponse } from "next/server";

// Create a new workflow
// @route POST /api/workflow/create
export const createWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workflow = await WorkflowService.createWorkflow(req.body);
    res
      .status(201)
      .json({ message: "Workflow created successfully", workflow });
    return;
  } catch (error) {
    next(error);
  }
};

// Get a workflows
// @route GET /api/workflow:id
export const getWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workflow = await WorkflowService.getWorkflow(req.params.id);
    res.status(200).json(workflow);
    return;
  } catch (error) {
    next(error);
  }
};

// Update a workflow
// @route PUT /api/workflow/:id
export const updateWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedWorkflow = await WorkflowService.updateWorkflow(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Workflow updated successfully", updatedWorkflow });
    return;
  } catch (error) {
    next(error);
  }
};

// Delete a workflow
// @route DELETE /api/workflow/:id
export const deleteWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await WorkflowService.deleteWorkflow(req.params.id);
    res.status(200).json({ message: "Workflow deleted successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

// Get all workflow IDs
export const getAllWorkflowIds = async (
  req: NextRequest
): Promise<NextResponse> => {
  logger.info("Fetching all workflow IDs");
  try {
    const workflowIds = await WorkflowService.getAllWorkflowIds();
    return NextResponse.json({ workflowIds });
  } catch (error: any) {
    logger.error(`Error in fetching workflow IDs: ${error}`);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

// Execute a workflow
// @route POST /api/workflow/execute/:workflowId
export const executeWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check Redis connection
    if (!redisClient.isReady) {
      res
        .status(503)
        .json({
          message: "Service Unavailable: Redis connection is not ready",
        });
      return;
    }

    // validating workflowId
    const { workflowId } = req.params;
    if (!workflowId) {
      res.status(400).json({ message: "Missing workflowId" });
      return;
    }

    // calling workflow service to get workflow
    const jobID = await WorkflowService.executeWorkflow(workflowId);

    res.status(202).json({ message: "Workflow execution started", jobID });
    return;
  } catch (error) {
    logger.error(`Error starting workflow execution: ${error}`);
    next(error);
  }
};

// Helper type for URL parameters extracted in the route handler
type WorkflowParams = {
  id?: string;
  workflowId?: string;
  jobId?: string;
};

// Get workflow status
export const getWorkflowStatus = async (
  req: NextRequest,
  params: WorkflowParams
): Promise<NextResponse> => {
  try {
    const { jobId } = await params;
    if (!jobId) {
      return NextResponse.json({ message: "Job ID parameter is required" }, { status: 400 });
    }

    const result = await WorkflowService.getWorkflowStatus(jobId);
    logger.info(`getWorkflowStatus result for job ${jobId}: ${JSON.stringify(result)}`);

    if (!result) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error(`Get workflow status error: ${error.message}`, { jobId: params.jobId, stack: error.stack });
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: error.status || 500 });
  }
};
