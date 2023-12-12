import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/groupModel";
import { connect } from "@/db/config";
import Profile from "@/models/profileModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const group_id = url.searchParams.get("groupId")

        const group = await Group.findOne({_id: group_id});
        return NextResponse.json({
            message: "Got group with id",
            group: group
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id, username, role } = getTokenData(request);
        const body = await request.json();
        const id_to_delete = body.groupId;
        const group: any = await Group.findOne({_id: id_to_delete});

        if (role === "PARTICIPANT" || id !== group.host_id) {
            return NextResponse.json({error: "You don't have permissions to delete that group"}, {status: 400})
        }

        const deleted = await Group.deleteOne({_id: id_to_delete});

        // remove the id from all profiles
        const profile = await Profile.updateMany({}, { $pull: { group_ids: id_to_delete } });

        return NextResponse.json({
            message: "Deleted group",
            groups: deleted
        })
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }
}