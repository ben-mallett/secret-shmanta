import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/productUtils";

export async function GET(request: NextRequest) {
    try {
        const all_products = await getAllProducts();

        return NextResponse.json({
            message: "Got all products",
            products: all_products
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}
