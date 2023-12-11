import { connect } from "@/db/config";
import User from "@/models/userModel";
import Profile from "@/app/profile/page";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(body);

        const {firstName, lastName, role, username, password} = body;
        
        if (await User.findOne({username})) {
            return NextResponse.json({error: "An elf already exists with that name"}, {status: 400});
        }

        const created = new User({
            firstName,
            lastName,
            role,
            username,
            password
        })
        const committed = await created.save();

        // const profile_created = new Profile({
        //     username,
        //     user_id: created._id,
        //     bio: "",
        //     links: [],
        //     group_ids: []
        // });

        return NextResponse.json({message: "Welcome to the workshop!", success: true, committed})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}