import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '../services/auth-service';
import { revokeToken } from '../store/data-store';
import logger from '../utils/logger';

export const login = async (req: NextRequest): Promise<NextResponse> => {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
        }

        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
             return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
        }

        const token = authenticateUser(username, password);

        if (token) {
            return NextResponse.json({ token });
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error: any) {
        logger.error(`Login error: ${error.message}`, { stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

export const logout = async (req: NextRequest): Promise<NextResponse> => {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
        }

        const authorizationHeader = req.headers.get('authorization');
        const token = authorizationHeader?.split(' ')[1];

        if (token) {
            revokeToken(token);
            return NextResponse.json({ message: 'Logout successfully' });
        } else {
            return NextResponse.json({ message: 'Authorization token is required' }, { status: 400 });
        }
    } catch (error: any) {
        logger.error(`Logout error: ${error.message}`, { stack: error.stack });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};