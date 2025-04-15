import {NextRequest, NextResponse} from "next/server";
import {isNullOrEmpty} from "@/app/lib/utils/utils";
import {v4} from "uuid";
import DBConnection from "@/app/database/wta/DBConnection";
import TestCase from "@/app/database/wta/models/TestCase";
import {promises as fs} from "fs";
import path from "path";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    //const uid = formData.get('uid') as string;
    const uid = 123;
    const feature = formData.get('feature') as string;
    const testCaseName = formData.get('testcasename') as string;
    const browser = formData.get('browser') as string;
    const url = formData.get('url') as string;
    const environment = formData.get('environment') as string;
    const configFile = "sample file";
    //const configFile = formData.get('config') as File | null;
    // const configFile = formData.get('file') as string;

    // if (isNullOrEmpty(uid)) {
    //     return NextResponse.json(
    //         {message: "uid is required"},
    //         {status: 400}
    //     );
    // }
    if (isNullOrEmpty(testCaseName)) {
        return NextResponse.json(
            {message: "test_case_name is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(feature)) {
        return NextResponse.json(
            {message: "feature is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(browser)) {
        return NextResponse.json(
            {message: "browser is required"},
            {status: 400}
        );
    }
    // if (configFile == null) {
    //     return NextResponse.json(
    //         {message: "config is required"},
    //         {status: 400}
    //     );
    // }
    // if (!(configFile instanceof File)) {
    //     return NextResponse.json(
    //         {message: "config is not a file"},
    //         {status: 400}
    //     );
    // }

    await DBConnection.connect();
    await DBConnection.syncModels();

    // const fileName = configFile.name;
    // const fileExtension = path.extname(fileName).toLowerCase();
    const testCaseUUID = v4()

    try {
        if (!isNullOrEmpty(testCaseName) && !isNullOrEmpty(feature) && !isNullOrEmpty(browser) && !isNullOrEmpty(url) && !isNullOrEmpty(environment)) {
            // const arrayBuffer = await configFile.arrayBuffer();
            // const buffer = Buffer.from(arrayBuffer);
            // const filePath = path.join(process.cwd(), `storage/${uid}/${testCaseUUID}`, fileName);
            // await fs.mkdir(path.dirname(filePath), {recursive: true});
            // await fs.writeFile(filePath, buffer);
            // console.log("process.cwd()", process.cwd());
            const createdTestCase = await TestCase.createTestCase(uid,testCaseUUID, testCaseName, feature, browser, configFile, url,environment);
            console.log("createdTestCase",createdTestCase);
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