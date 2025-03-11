import { NextRequest, NextResponse } from "next/server";
import { isNullOrEmpty } from "@/app/lib/utils/utils";
import DBConnection from "@/app/database/mta/DBConnection";
import User from "@/app/database/mta/models/User";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const headers = request.headers;
    const timezone = headers.get('timezone') as string;
    const userName = formData.get('user_name') as string;
    const password = formData.get('password') as string;
    console.log("Timezone:", timezone);

    if (isNullOrEmpty(userName)) {
        return NextResponse.json(
            { message: "user_name is required" },
            {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin'
                }
            }
        );
    }
    if (isNullOrEmpty(password)) {
        return NextResponse.json(
            { message: "password is required" },
            {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin'
                }
            }
        );
    }

    await DBConnection.connect();
    await DBConnection.syncModels();

    try {
        const user = await User.authenticateUser(userName);
        if (user) {
            return NextResponse.json(
                {
                    message: "User authenticated.",
                    data: user.toJSON()
                },
                {
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin'
                    }
                }
            );
        } else {
            return NextResponse.json(
                { message: "Invalid username or password" },
                {
                    status: 401,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin'
                    }
                }
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: (error as Error).message },
                {
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin'
                    }
                }
            );
        } else {
            return NextResponse.json(
                { message: "An error occurred" },
                {
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Access-Control-Allow-Origin'
                    }
                }
            );
        }
    }
}