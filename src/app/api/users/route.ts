import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/config";

connect();

export async function GET(request: NextRequest) {
    try {
        let role = "PARTICIPANT"
        try {
            const { id, user, userRole } = getTokenData(request);
            role = userRole
        } catch (error: any) {
            console.log("User not logged in");
        }

        let users = null;
        if (role !== "ADMIN") {
            users = await User.find({}, { password: 0, firstName: 0, lastName: 0 })
        } else {
            users = await User.find({})
            console.log(users)
        }
        return NextResponse.json({
            message: "Got user info",
            users: users
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}