import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/groupModel";
import { connect } from "@/db/config";
import Profile from "@/models/profileModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const groups = await Group.find({});
        return NextResponse.json({
            message: "Got all groups",
            groups: groups
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}

export async function POST(request: NextRequest) {
    try {
        const { id, username, role } = getTokenData(request);
        if (role === "PARTICIPANT") {
            return NextResponse.json({error: "User not authorized to create groups. Must be Admin or Host role."}, {status: 400})
        }
        const { name, description } = await request.json();

        const created = new Group({
            name,
            description,
            role,
            host_id: id,
            members: [id]
        })

        const committed = await created.save();
        const group_id = committed._id;
        const updated = await Profile.updateOne({user_id: id}, { $push: { group_ids: group_id } })

        return NextResponse.json({message: "Group created! It's the giving season!", success: true, committed})
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}