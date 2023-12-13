import { connect } from "@/db/config";
import User from "@/models/userModel";
import Profile from "@/models/profileModel";
import { NextRequest, NextResponse } from "next/server";
import Wishlist from "@/models/wishlistModel";

connect();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

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

        const bio = "";
        const links: string[] = [];
        const group_ids: string[] = [];
        const user_id = created._id;

        const profile_created = new Profile({
            user_id,
            bio,
            links,
            group_ids
        });
        await profile_created.save();

        const gifts: string[] = [];
        
        const wishlist_created = new Wishlist({
            user_id,
            gifts
        })
        await wishlist_created.save();

        return NextResponse.json({message: "Welcome to the workshop!", success: true, committed})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}