"use client"

import Header from "@/components/header"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Snowfall from "react-snowfall"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductList from "@/components/product-list"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
    const { toast } = useToast()
    const searchQuery = usePathname().split('/')[2]
    const [search, setSearch] = useState<string>("")
    const [products, setProducts] = useState<any[]>([])
    useEffect(() => {
        const getProductsBySearch = async () => {
            try {
                const response = await axios.get(`/api/products/by/search`, {
                    params: {
                        search: searchQuery
                    }
                })

                const prods = response.data.products;
                setProducts(prods);
            } catch (error : any) {
                toast({
                    title: "Uh oh... Something went wrong.",
                    description: `Error getting search results: ${error.response.data.error}`
                })
            }
        }

        getProductsBySearch().catch((e) => {
            console.log(e);
        })
    }, [])
    return (
        <div>
            <Header/>
            <Snowfall
                color="#D8E8EE"
                style={{ background: "224 71.4% 4.1%", zIndex: -1}}
                snowflakeCount={300}
            />
            <div className="flex flex-col justify-center items-center">
                <Card className="w-1/2 m-10 flex flex-col justify-center items-center">
                    <CardTitle className="m-5 scroll-m-20 text-4xl tracking-tight lg:text-5xl">
                        Want more?
                    </CardTitle>
                    <CardDescription>
                        Explore more gifts, just one search away...
                    </CardDescription>
                    <CardContent className="w-full">
                        <div className="w-full flex items-center space-x-2 self-center mt-5">
                            <Input type="text" className="px-3 py-2 w-full" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                            <Link className="px-3 py-2 w-1/5" href={`/search/${search}`}>
                                <Button className="w-full" >Search</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <div className="w-full flex flex-col justify-center items-center">
                    {products.length > 0 ? <div className="w-4/5"><ProductList products={products}></ProductList></div> : <Card className="w-1/2 h-40 flex flex-col justify-center items-center"><CardTitle>No Products Found</CardTitle></Card>}
                </div>
            </div>
        </div>
    )
}