import { NextRequest, NextResponse } from "next/server"
import { getProductById } from "@/lib/productUtils"

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get("productId")
        const product = await getProductById(parseInt(id as unknown as string));
        return NextResponse.json({
            message: "Got product by id",
            product: product
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}