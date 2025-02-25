import {NextRequest, NextResponse} from "next/server";
import {isNullOrEmpty} from "@/app/lib/utils/utils";
import DBConnection from "@/app/database/DBConnection";
import path from "path";
import {promises as fs} from "fs";
import TestCase from "@/app/database/models/TestCase";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const uid = formData.get('uid') as string;
    const testCaseName = formData.get('test_case_name') as string;
    const id = formData.get('id') as string;
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
    if (isNullOrEmpty(id)) {
        return NextResponse.json(
            {message: "id is required"},
            {status: 400}
        );
    }

    if (config != null && !(config instanceof File)) {
        return NextResponse.json(
            {message: "config is not a file"},
            {status: 400}
        );
    }

    await DBConnection.connect();
    await DBConnection.syncModels();

    if (config != null) {

        const fileName = config.name;
        const fileExtension = path.extname(fileName).toLowerCase();

        try {
            if (fileExtension === '.json' || fileExtension === '.jsonl') {
                const arrayBuffer = await config.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const filePath = path.join(process.cwd(), `app/storage/${uid}/${id}`, fileName);
                await fs.unlink(path.join(process.cwd(), `app/storage/${uid}/${id}`));
                await fs.mkdir(path.dirname(filePath), {recursive: true});
                await fs.writeFile(filePath, buffer);
                await TestCase.updateTestCase(
                    id,
                    testCaseName,
                    filePath,
                );
                return NextResponse.json(
                    {
                        message: "Test case updated.",
                        data: null
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
    } else {
        await TestCase.updateTestCase(
            id,
            testCaseName,
            null
        );
        return NextResponse.json(
            {
                message: "Test case updated.",
                data: null
            },
            {
                status: 200
            }
        );
    }


}
