import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/config";

connect();

export async function GET(request: NextRequest) {
    try {
        const { id, username, role } = getTokenData(request);
        let users = null;
        if (role !== "ADMIN") {
            users = await User.find({}, { password: 0, firstName: 0, lastName: 0 })
        } else {
            users = await User.find({})
        }
        return NextResponse.json({
            message: "Got profile info",
            users: users
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}