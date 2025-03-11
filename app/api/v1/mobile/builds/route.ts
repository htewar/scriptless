import {isNullOrEmpty} from "@/app/lib/utils/utils";
import {NextRequest, NextResponse} from "next/server";
import path from 'path';
import {promises as fs} from 'fs';
import AdmZip from 'adm-zip';
import DBConnection from "@/app/database/mta/DBConnection";
import Build from "@/app/database/mta/models/Build";
import {v4} from "uuid";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const uid = formData.get('uid') as string;
    const build = formData.get('build') as File | null;

    if (!uid) {
        return NextResponse.json({message: "uid is required."}, {status: 400});
    }
    if (!build) {
        return NextResponse.json({message: "build is required"}, {status: 400});
    }
    if (!(build instanceof File)) {
        return NextResponse.json({message: "build is not a file"}, {status: 400});
    }

    await DBConnection.connect();
    await DBConnection.syncModels();

    const fileName = build.name;
    const fileExtension = path.extname(fileName).toLowerCase();

    console.log("File:", fileName, "Extension:", fileExtension);

    try {
        if ([".apk", ".aab", ".ipa", ".app", ".zip"].includes(fileExtension)) {
            const arrayBuffer = await build.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const buildDir = path.join(process.cwd(), `storage/${uid}/builds`);

            await fs.mkdir(buildDir, {recursive: true});

            if (fileExtension === ".zip") {
                const zip = new AdmZip(buffer);
                const zipEntries = zip.getEntries();

                const appEntry = zipEntries.find(entry => entry.entryName.endsWith(".app/"));
                if (!appEntry) {
                    return NextResponse.json({message: "zip file must contain an .app bundle."}, {status: 400});
                }
                zip.extractAllTo(buildDir, true);
                const build = await Build.createBuild(
                    v4(),
                    uid,
                    fileName.split(".")[0],
                    '.app',
                    'iOS',
                    `${buildDir}/${fileName}.app`
                )
                return NextResponse.json({message: "Build Uploaded successfully.", build: build}, {status: 200});
            } else {
                const filePath = path.join(buildDir, fileName);
                await fs.writeFile(filePath, buffer);
                const build = await Build.createBuild(
                    v4(),
                    uid,
                    fileName.split(".")[0],
                    fileExtension,
                    fileExtension === '.apk' || fileExtension === '.aab' ? 'android' : 'iOS',
                    filePath
                )
                return NextResponse.json({message: "Build Uploaded successfully.", build: build}, {status: 200});
            }
        } else {
            return NextResponse.json({message: `Invalid build format: ${fileExtension}`}, {status: 400});
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: `Enable to upload build :: ${e}`}, {status: 400});
    }
}

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const uid = searchParams.get('uid');

    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            {message: "uid is required"},
            {status: 400}
        );
    }
    await DBConnection.connect()
    await DBConnection.syncModels()

    try {
        const builds = await Build.getBuilds(uid);
        return NextResponse.json(
            {
                message: `${builds.length === 0} ? "No Builds found." : "Builds found."`,
                builds: builds
            },
            {status: 200}
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "No Builds found.",
                builds: []
            },
            {status: 200}
        );
    }
}

export async function DELETE(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const uid = searchParams.get('uid');
    const buildUUID = searchParams.get('build_uuid');

    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            {message: "uid is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(buildUUID)) {
        return NextResponse.json(
            {message: "build_uuid is required"},
            {status: 400}
        );
    }

    await DBConnection.connect()
    await DBConnection.syncModels()

    try {
        const build = await Build.getBuild(buildUUID);
        await Build.deleteBuild(buildUUID);
        if (build === null) {
            return NextResponse.json(
                {message: "Build not found."},
                {status: 404}
            );
        }
        await fs.unlink(build.path);
        return NextResponse.json(
            {message: "Build deleted successfully."},
            {status: 200}
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {message: "Build not found."},
            {status: 404}
        );
    }
}