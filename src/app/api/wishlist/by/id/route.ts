import { NextRequest, NextResponse } from "next/server"
import { getProductById } from "@/lib/productUtils"
import Wishlist from "@/models/wishlistModel"

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get("userId")
        
        const wishlist: any = await Wishlist.findOne({user_id: id});

        const products = await Promise.all(wishlist.gifts.map(async (item: string) => {
            const product = await getProductById(parseInt(item as unknown as string));
            return product
        }))

        return NextResponse.json({
            message: "Got wishlist by user id",
            wishlist: products
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}