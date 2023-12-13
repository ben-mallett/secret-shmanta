import { getTokenData } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/config";
import jwt from "jsonwebtoken";

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
        
        const { id, user, role } = getTokenData(request);
        const data = await request.json();

        const db_response = await User.updateOne({_id: id}, {...data})
        if (db_response.acknowledged) {
            const user = await User.findOne({_id: id}, {password: 0});

            // refresh the token
            const tokenConfig = {
                id: user._id,
                username: user.username,
                role: user.role
            }
            const token = await jwt.sign(tokenConfig, process.env.JWT_SECRET!, {expiresIn: "1h"})

            const response =  NextResponse.json({
                message: "Updated your account!",
                success: true,
                user: user
            });
            response.cookies.set("token", token, {
                httpOnly: true
            });
            return response
        } else {
            throw new Error("Update not acknowledged");
        }
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}