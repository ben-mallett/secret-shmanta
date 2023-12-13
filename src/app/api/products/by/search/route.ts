import { NextRequest, NextResponse } from "next/server"
import { searchProducts } from "@/lib/productUtils"

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const query = url.searchParams.get("search")
        console.log(query);
        const products = await searchProducts(query as unknown as string);
        console.log(products);
        return NextResponse.json({
            message: "Got product by id",
            products: products.products
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}