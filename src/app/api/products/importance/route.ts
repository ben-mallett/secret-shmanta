import { NextRequest, NextResponse } from "next/server"
import Wishlist from "@/models/wishlistModel"
import User from "@/models/userModel"

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get("productId")
        const wishlists = await Wishlist.find({ gifts: {
            $in: [id]
        }})
        const user_ids: string[] = wishlists.map((wishlist) => {
            return wishlist.user_id;
        })

        const users = await User.find({ _id: { $in: user_ids }})

        return NextResponse.json({
            message: "Got product by id",
            users: users
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}