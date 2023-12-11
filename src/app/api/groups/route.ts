import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/groupModel";
import { connect } from "@/db/config";

connect();

export async function GET(request: NextRequest) {
    try {
        const { id, username, role } = getTokenData(request);
        const groups = await Group.find({});
        return NextResponse.json({
            message: "Got all groups",
            groups: groups
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}