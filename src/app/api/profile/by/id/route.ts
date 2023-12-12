import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/config";
import Profile from "@/models/profileModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const user_id = url.searchParams.get("userId")

        const profile = await Profile.findOne({user_id: user_id});
        return NextResponse.json({
            message: "Got user with id",
            profile: profile
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}