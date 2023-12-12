import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import Profile from "@/models/profileModel"
import { connect } from "@/db/config";
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const { id } = getTokenData(request);
        const profile = await Profile.findOne({ user_id: id });
        return NextResponse.json({
            message: "Got profile info",
            profile: profile
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id } = getTokenData(request);
        const data = await request.json();
        const { firstName, lastName, bio, urls } = data;

        const user_db_response = await User.updateOne({_id: id}, {firstName, lastName})

        let user = null;
        if (user_db_response.acknowledged) {
            user = await User.findOne({_id: id});
        } else {
            throw new Error("User update not acknowledged");
        }

        const db_response = await Profile.updateOne({user_id: id}, {bio: bio, links: urls})

        let profile = null
        if (db_response.acknowledged) {
            profile = await Profile.findOne({user_id: id});
        } else {
            throw new Error("Profile update not acknowledged");
        }
        const response =  NextResponse.json({
            message: "Updated your account!",
            success: true,
            profile: profile,
            user: user
        });

        return response
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}
