import {NextRequest, NextResponse} from "next/server";
import {isNullOrEmpty} from "@/app/lib/utils/utils";
import DBConnection from "@/app/database/DBConnection";
import User from "@/app/database/models/User";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const uid = searchParams.get('uid');
    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            {message: "uid is required"},
            {status: 400}
        );
    }
    await DBConnection.connect();
    await DBConnection.syncModels();
    try {
        const user = await User.getUserByID(uid);
        if (user) {
            return NextResponse.json(
                {
                    message: "User found.",
                    data: user.toJSON()
                },
                {
                    status: 200
                }
            );
        } else {
            return NextResponse.json(
                {message: "User not found"},
                {status: 404}
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

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const uid = formData.get('uid') as string;
    const userName = formData.get('user_name') as string;
    const token = formData.get('token') as string;

    if (isNullOrEmpty(uid)) {
        return NextResponse.json(
            {message: "uid is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(userName)) {
        return NextResponse.json(
            {message: "user_name is required"},
            {status: 400}
        );
    }
    if (isNullOrEmpty(token)) {
        return NextResponse.json(
            {message: "token is required"},
            {status: 400}
        );
    }

    await DBConnection.connect();
    await DBConnection.syncModels();

    try {
        const user = await User.createUser(uid, userName, token);
        return NextResponse.json(
            {
                message: "User created.",
                data: user.toJSON()
            },
            {
                status: 200
            }
        );
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