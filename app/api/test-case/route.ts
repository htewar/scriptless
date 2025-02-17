import { NextApiRequest, NextApiResponse } from 'next';
import dbClient from '../../../app/db/schemas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbClient.initDataBase();

    switch (req.method) {
        case 'GET':
            const testCases = await dbClient.getTestCases();
            res.status(200).json(testCases);
            break;
        case 'POST':
            await dbClient.insertTempTestCases();
            res.status(201).json({ message: 'Test cases inserted' });
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}