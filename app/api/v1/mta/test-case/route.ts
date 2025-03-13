import DBConnection from "@/app/database/mta/DBConnection";
import {isNullOrEmpty} from "@/app/lib/utils/utils";
import {NextRequest, NextResponse} from "next/server";
import TestCase from "@/app/database/mta/models/TestCase";
import path from "path";
import {promises as fs} from "fs";
import {v4} from "uuid";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');
    const uid = searchParams.get('uid');
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');
    const searchQuery = searchParams.get('query') || '';
    await DBConnection.connect();
    await DBConnection.syncModels();

    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            {message: "uid is required"},
            {status: 400}
        );
    }

    try {
        if (isNullOrEmpty(id)) {
            const testCases = (await TestCase.getTestCases(searchQuery, uid, offset, limit)).map(testCase => testCase.toJSON());
            return NextResponse.json(
                {
                    message: "Test cases found.",
                    data: testCases
                },
                {
                    status: 200
                }
            );
        } else {
            const testCase = await TestCase.getTestCaseByUUID(id);
            if (testCase) {
                return NextResponse.json(
                    {
                        message: "Test case found.",
                        data: testCase.toJSON()
                    },
                    {
                        status: 200
                    }
                );
            } else {
                return NextResponse.json(
                    {message: "Test case not found"},
                    {status: 404}
                );
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                {message: (error as Error).message},
                {status: 500}
            );
        } else {
            return NextResponse.json(
                {message: "An error occurred"},
                {status: 500}
            );
        }
    }
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const uid = formData.get('uid') as string;
    const testCaseName = formData.get('test_case_name') as string;
    const appName = formData.get('app_name') as string;
    const platform = formData.get('platform') as string;
    const config = formData.get('config') as File | null;

    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            {message: "uid is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(testCaseName)) {
        return NextResponse.json(
            {message: "test_case_name is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(appName)) {
        return NextResponse.json(
            {message: "app_name is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(platform)) {
        return NextResponse.json(
            {message: "platform is required"},
            {status: 400}
        );
    }
    if (config == null) {
        return NextResponse.json(
            {message: "config is required"},
            {status: 400}
        );
    }
    if (!(config instanceof File)) {
        return NextResponse.json(
            {message: "config is not a file"},
            {status: 400}
        );
    }

    await DBConnection.connect();
    await DBConnection.syncModels();

    const fileName = config.name;
    const fileExtension = path.extname(fileName).toLowerCase();
    const testCaseUUID = v4()

    try {
        if (fileExtension === '.json' || fileExtension === '.jsonl') {
            const arrayBuffer = await config.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const filePath = path.join(process.cwd(), `storage/${uid}/${testCaseUUID}`, fileName);
            await fs.mkdir(path.dirname(filePath), {recursive: true});
            await fs.writeFile(filePath, buffer);
            const createdTestCase = await TestCase.createTestCase(testCaseUUID, uid, testCaseName, appName, platform, filePath);
            return NextResponse.json(
                {
                    message: "Test case created.",
                    data: createdTestCase.toJSON()
                },
                {
                    status: 200
                }
            );
        } else {
            return NextResponse.json(
                {message: "config must be json"},
                {status: 400}
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                {message: (error as Error).message},
                {status: 500}
            );
        } else {
            return NextResponse.json(
                {message: "An error occurred"},
                {status: 500}
            );
        }
    }
}