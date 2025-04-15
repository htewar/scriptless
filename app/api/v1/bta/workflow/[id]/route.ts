import { NextRequest, NextResponse } from 'next/server';
import * as WorkflowService from '@bta-src/services/workflow-service';
import logger from '@bta-src/utils/logger';

// Helper type for params
type WorkflowIdParams = {
    params: {
        id: string; // Corresponds to the [id] directory name
    }
};

export async function GET(req: NextRequest, { params }: WorkflowIdParams): Promise<NextResponse> {
    const { id } = await params;
    logger.info(`Handling GET request for /api/v1/bta/workflow/${id}`);
    try {
        const workflow = await WorkflowService.getWorkflow(id);
        return NextResponse.json(workflow);
    } catch (error: any) {
        logger.error(`Unexpected error in GET /workflow/[id] route: ${error.message}`, { id, stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: WorkflowIdParams): Promise<NextResponse> {
    const { id } = await params;
    logger.info(`Handling PUT request for /api/v1/bta/workflow/${id}`);
    try {
        const body = await req.json();
        const updatedWorkflow = WorkflowService.updateWorkflow(id, body);
        return NextResponse.json({ message: "Workflow updated successfully", updatedWorkflow });
    } catch (error: any) {
        logger.error(`Unexpected error in PUT /workflow/[id] route: ${error.message}`, { id, stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: WorkflowIdParams): Promise<NextResponse> {
    const { id } = await params;
    logger.info(`Handling DELETE request for /api/v1/bta/workflow/${id}`);
    try {
        WorkflowService.deleteWorkflow(id);
        return NextResponse.json({ message: "Workflow deleted successfully" });
    } catch (error: any) {
        logger.error(`Unexpected error in DELETE /workflow/[id] route: ${error.message}`, { id, stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 