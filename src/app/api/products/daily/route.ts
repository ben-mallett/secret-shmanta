import { NextRequest, NextResponse } from "next/server";
import { getDailyProducts } from "@/lib/productUtils";

export async function GET(request: NextRequest) {
    try {
        const daily_products = await getDailyProducts();

        return NextResponse.json({
            message: "Got products of the day",
            products: daily_products
        })
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
}
