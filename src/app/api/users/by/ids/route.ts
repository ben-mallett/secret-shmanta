import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/config";

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const ids = url.searchParams.get("userIds")?.split(',')
        const users = await User.find({ _id: { $in: ids } })
        return NextResponse.json({
            message: "Got all users",
            users: users
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}