import { NextRequest, NextResponse } from 'next/server';
import * as WorkflowService from '@bta-src/services/workflow-service';
import logger from '@bta-src/utils/logger';

// Helper type for params
type ExecuteWorkflowParams = {
    params: {
        workflowId: string; // Corresponds to the [workflowId] directory name
    }
};

export async function POST(req: NextRequest, { params }: ExecuteWorkflowParams): Promise<NextResponse> {
    const { workflowId } = await params;
    logger.info(`Handling POST request for /api/v1/bta/workflow/execute/${workflowId}`);
    try {
        const jobId = await WorkflowService.executeWorkflow(workflowId);
        return NextResponse.json({ message: "Workflow execution started", jobId });
    } catch (error: any) {
        logger.error(`Unexpected error in POST /workflow/execute/[workflowId] route: ${error.message}`, { workflowId, stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 