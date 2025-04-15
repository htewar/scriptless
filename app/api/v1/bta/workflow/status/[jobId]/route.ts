import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowStatus } from '@bta-src/controllers/WorkflowController';
import logger from '@bta-src/utils/logger';

// Helper type for params
type WorkflowStatusParams = {
    params: {
        jobId: string; // Corresponds to the [jobId] directory name
    }
};

export async function GET(req: NextRequest, { params }: WorkflowStatusParams): Promise<NextResponse> {
    const { jobId } = await params;
    logger.info(`Handling GET request for /api/v1/bta/workflow/status/${jobId}`);
    try {
         // Controller handles method check, errors
        return await getWorkflowStatus(req, params);
    } catch (error: any) {
        logger.error(`Unexpected error in GET /workflow/status/[jobId] route: ${error.message}`, { jobId: params.jobId, stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 