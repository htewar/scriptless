import {isNullOrEmpty} from "@/app/lib/utils/utils";
import {NextRequest, NextResponse} from "next/server";
import path from 'path';
import {promises as fs} from 'fs';
import AdmZip from 'adm-zip';

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

    const fileName = build.name;
    const fileExtension = path.extname(fileName).toLowerCase();

    console.log("File:", fileName, "Extension:", fileExtension);

    if ([".apk", ".aab", ".ipa", ".app", ".zip"].includes(fileExtension)) {
        const arrayBuffer = await build.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const buildDir = path.join(process.cwd(), `app/storage/${uid}/builds`);

        await fs.mkdir(buildDir, {recursive: true});

        if (fileExtension === ".zip") {
            const zip = new AdmZip(buffer);
            const zipEntries = zip.getEntries();

            // Find the .app bundle inside the zip
            const appEntry = zipEntries.find(entry => entry.entryName.endsWith(".app/"));
            if (!appEntry) {
                return NextResponse.json({message: "zip file must contain an .app bundle."}, {status: 400});
            }

            // Extract the entire .app bundle
            zip.extractAllTo(buildDir, true);

            return NextResponse.json({message: "Build Uploaded successfully."}, {status: 200});
        } else {
            const filePath = path.join(buildDir, fileName);
            await fs.writeFile(filePath, buffer);

            return NextResponse.json({message: "Build Uploaded successfully."}, {status: 200});
        }
    } else {
        return NextResponse.json({message: `Invalid build format: ${fileExtension}`}, {status: 400});
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

    const buildsDir = path.join(process.cwd(), `app/storage/${uid}/builds`);

    try {
        const files = await fs.readdir(buildsDir);
        const validExtensions = ['.apk', '.aab', '.ipa', '.app'];
        const filesResponse = await Promise.all(files
            .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
            .map(async (file, index) => {
                const filePath = path.join(buildsDir, file);
                const stats = await fs.stat(filePath);
                const fileType = path.extname(file).toLowerCase() === '.apk' || path.extname(file).toLowerCase() === '.aab' ? 'android' : 'iOS';
                return {
                    id: index,
                    name: file.split(".")[0],
                    type: fileType,
                    uploadedDate: stats.mtime,
                    ext: path.extname(file).toLowerCase(),
                    path: `storage/${uid}/builds/${file}`
                };
            }));
        return NextResponse.json(
            {
                message: "Builds found.",
                builds: filesResponse
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
    const buildName = searchParams.get('build');

    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            {message: "uid is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(buildName)) {
        return NextResponse.json(
            {message: "buildName is required"},
            {status: 400}
        );
    }

    const filePath = path.join(process.cwd(), `app/storage/${uid}/builds`, buildName);

    try {
        await fs.unlink(filePath);
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