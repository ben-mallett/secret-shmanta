import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/config";

connect();

export async function GET(request: NextRequest) {
    try {
        const { id } = getTokenData(request);
        const user = await User.findOne({_id: id}, {password: 0});
        return NextResponse.json({
            message: "Got user info",
            user: user
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}

export async function PUT(request: NextRequest) {
    try {
        
        const { id } = getTokenData(request);
        const data = await request.json();
        const db_response = await User.updateOne({_id: id}, {...data})
        if (db_response.acknowledged) {
            const user = await User.findOne({_id: id}, {password: 0});
            const response =  NextResponse.json({
                message: "Updated your account!",
                success: true,
                user: user
            });
            return response
        } else {
            throw new Error("Update not acknowledged");
        }
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}