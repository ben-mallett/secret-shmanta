import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/groupModel";
import Profile from "@/models/profileModel";
import { getTokenData } from "@/lib/tokenUtils";

export async function GET(request: NextRequest) {
    try {
        const { id, user, role } = getTokenData(request);
        const url = new URL(request.url)
        const group_id = url.searchParams.get("groupId")

        const updated = await Group.updateOne({_id: group_id}, { $push: {members: id}})

        const updated_prof = await Profile.updateOne({user_id: id}, { $push: {group_ids: group_id}})

        if (updated.acknowledged && updated_prof.acknowledged) {
            const response = NextResponse.json(
                {
                    message: "Joined group! Get ready to give some gifts!",
                    success: true,
                    group: updated,
                    profile: updated
                }
            );
            return response;
        } else {
            throw new Error("Updating group or profile failed. Please try again!")
        }
    } catch (error: any) {
        return NextResponse.json({error: error.message }, {status: 500});
    }
}