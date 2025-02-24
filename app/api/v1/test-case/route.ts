import DBConnection from "@/app/database/DBConnection";
import {isNullOrEmpty} from "@/app/lib/utils/utils";
import {NextRequest, NextResponse} from "next/server";
import TestCase from "@/app/database/models/TestCase";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const uid = searchParams.get('uid');
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');
    const searchQuery = searchParams.get('query') || '';
    await DBConnection.connect();
    await DBConnection.syncModels();

    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            { message: "uid is required" },
            { status: 400 }
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
                    { message: "Test case not found" },
                    { status: 404 }
                );
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: (error as Error).message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { message: "An error occurred" },
                { status: 500 }
            );
        }
    }
}