import { getTokenData } from "@/lib/tokenUtils"
import Wishlist from "@/models/wishlistModel"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const {id, user, role} = getTokenData(request);
        const url = new URL(request.url)
        const prod_id = url.searchParams.get("productId")
        const db_response = await Wishlist.updateOne({user_id: id}, {$addToSet: {gifts: prod_id}})

        if (db_response.acknowledged) {
            return NextResponse.json({
                message: "Updated wishlist"
            })
        } else {
            throw new Error("DB response not acknowledged for Wishlist update")
        }
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}