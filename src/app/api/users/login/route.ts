import { connect } from "@/db/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const user = await User.findOne({username})

        if (!user) {
            return NextResponse.json({error: "No elf exists by that name"}, {status: 400});
        }
        if (password !== user.password) {
            return NextResponse.json({error: "Uh oh... That's not the password for that elf's account!"}, {status: 400})
        }

        const tokenConfig = {
            id: user._id,
            username: user.username,
            role: user.role
        }
        const token = await jwt.sign(tokenConfig, process.env.JWT_SECRET!, {expiresIn: "1h"})
        
        const response =  NextResponse.json({
            message: "Welcome back! Here's a cookie!",
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            success: true
        });
        response.cookies.set("token", token, {
            httpOnly: true
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}