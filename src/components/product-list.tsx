"use client"

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios"
import { toast } from "@/components/ui/use-toast";
import { Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "./ui/button";
import Link from "next/link";
import { useUser } from "./user-provider";

type ProductListProps = {
    products: {
        id: string,
        title: string,
        description: string,
        price: number,
        discountPercentage: number,
        rating: number,
        stock: number,
        brand: string,
        category: string,
        thumbnail: string,
        images: string[]
    }[]
}

export default function ProductList(props: ProductListProps) {
    const { user } = useUser();
    const [userWishlistIds, setUserWishlistIds] = useState<string[]>([]);
    
    const removeFromWishlist = async (productId: string) => {
        try {
            const response = await axios.get(`/api/wishlist/remove`, { params: {
                productId: productId
            }})

            toast({
                title: "Successfully removed item from wishlist"
            })
            setUserWishlistIds(userWishlistIds.filter((id) => id !== productId))
        } catch (error : any) {
            toast({
                title: "Failed to remove item from wishlist",
                description: `${error.response.data.error}`
            })
        }
    }

    const addToWishlist = async (productId: string) => {
        try {
            const response = await axios.get(`/api/wishlist/add`, { params: {
                productId: productId
            }})

            toast({
                title: "Successfully added item to wishlist"
            })
            setUserWishlistIds([...userWishlistIds, productId])
        } catch (error : any) {
            toast({
                title: "Failed to remove item from wishlist",
                description: `${error.response.data.error}`
            })
        }
    }

    useEffect(() => {
        const getWishlistIds = async () => {
            try {
                if (user) {
                    const response = await axios.get("/api/wishlist/by/id", {
                        params: {
                            userId: user._id
                        }
                    });
                    const wishlist = response.data.wishlist.map((product: any) => product.id);
                    setUserWishlistIds(wishlist)
                }
            } catch (error : any) {
                toast({
                    title: "Error fetching products",
                    description: `${error}`
                })
            }
        }

        getWishlistIds().catch((e) => {
            console.log(e);
        })
    }, [user])

    return (
        <div className="flex flex-col justify-center items-center m-4 w-full">
            {
                props.products.map((product, i) => {
                    return (
                        <Card key={i} className="w-full m-2">
                            <CardHeader className="flex flex-row justify-between gap-10 items-start">
                                <Link href={`/product/${product.id}`}>
                                    <div>
                                        <CardTitle>{product.title}</CardTitle>
                                        <CardDescription>{product.description}</CardDescription>
                                    </div>
                                </Link>
                                {user !== null ? (userWishlistIds.includes(product.id) ? <Button className="self-end" variant="destructive" onClick={() => removeFromWishlist(product.id)}>Remove from Wishlist</Button> : <Button className="self-end" onClick={() => addToWishlist(product.id)}>Add to Wishlist</Button>) : 
                                <Link href="/login" className="self-end">
                                    <Button>
                                        Log in to save product.
                                    </Button>
                                </Link>}
                            </CardHeader>
                        </Card>
                    )
                })
            }
        </div>
    );
}