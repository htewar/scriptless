import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@bta-src/controllers/AuthController';
import logger from '@bta-src/utils/logger';

export async function POST(req: NextRequest): Promise<NextResponse> {
    logger.info(`Handling POST request for /api/v1/bta/auth/logout`);
    try {
        // Controller function already handles request method check, token extraction, and error response
        return await logout(req);
    } catch (error: any) {
         // Fallback error handler in case the controller throws unexpectedly
        logger.error(`Unexpected error in /auth/logout route: ${error.message}`, { stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 