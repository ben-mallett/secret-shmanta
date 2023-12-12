import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Profile from "@/models/profileModel"
import { connect } from "@/db/config";
import { getTokenData } from "@/lib/tokenUtils";
import Group from "@/models/groupModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get("userId")
        const user = await User.findOne({_id: id}, {password: 0, firstName: 0, lastName: 0})
        return NextResponse.json({
            message: "Got user by id",
            user: user
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id, username, role } = getTokenData(request);
        const body = await request.json();
        const id_to_delete = body.userId;

        if (role !== "ADMIN") {
            return NextResponse.json({error: "You don't have permissions to delete users"}, {status: 400})
        }

        const deleted = await User.deleteOne({_id: id_to_delete});

        const prof_delete = await Profile.deleteOne({user_id: id_to_delete});

        // remove the id from all groups
        const group_updates = await Group.updateMany({}, { $pull: { members: id_to_delete } })

        return NextResponse.json({
            message: "Deleted user and removed all traces",
            user: deleted
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}