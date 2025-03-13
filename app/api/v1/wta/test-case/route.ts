import {NextRequest, NextResponse} from "next/server";
import DBConnection from "@/app/database/wta/DBConnection";

export async function POST(request: NextRequest) {
    await DBConnection.connect();
    await DBConnection.syncModels();
    return NextResponse.json(
        {
            message: "Web Test Automation"
        }
    )
}