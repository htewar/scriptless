import { NextRequest, NextResponse } from 'next/server';
import * as WorkflowService from '@bta-src/services/workflow-service';
import logger from '@bta-src/utils/logger';

export async function POST(req: NextRequest): Promise<NextResponse> {
    logger.info(`Handling POST request for /api/v1/bta/workflow/create`);
    try {
        const body = await req.json();
        const workflow = WorkflowService.createWorkflow(body);
        return NextResponse.json({ message: "Workflow created successfully", workflow }, { status: 201 });
    } catch (error: any) {
        logger.error(`Unexpected error in /workflow/create route: ${error.message}`, { stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 