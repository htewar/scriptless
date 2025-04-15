import { NextRequest, NextResponse } from 'next/server';
import { getAllWorkflowIds } from '@bta-src/controllers/WorkflowController';
import logger from '@bta-src/utils/logger';

export async function GET(req: NextRequest): Promise<NextResponse> {
    logger.info(`Handling GET request for /api/v1/bta/workflow/ids`);
    try {
        return await getAllWorkflowIds(req);
    } catch (error: any) {
        logger.error(`Unexpected error in /workflow/ids route: ${error.message}`, { stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 