"use client"

import Header from "@/components/header"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Snowfall from "react-snowfall";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/user-provider";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircleUserRound } from "lucide-react";

export default function ProductDetailsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const [product, setProduct] = useState<{id: string, title: string, description: string, images: string[]}>()
    const [relatedUsers, setRelatedUsers] = useState<any>();
    const [wishlist, setWishlist] = useState<string[]>([])
    const productId = usePathname().split("/")[2]
    const [refresh, setRefresh] = useState<number>(0);

    const removeFromWishlist = async (productId: string) => {
        try {
            const response = await axios.get(`/api/wishlist/remove`, { params: {
                productId: productId
            }})

            toast({
                title: "Successfully removed item from wishlist"
            })
            setWishlist(wishlist.filter((id) => id !== productId));
            setRefresh(refresh + 1);
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
            setWishlist([...wishlist, productId]);
            setRefresh(refresh + 1);
        } catch (error : any) {
            toast({
                title: "Failed to remove item from wishlist",
                description: `${error.response.data.error}`
            })
        }
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get("/api/products/by/id", {
                    params: {
                        productId: productId
                    }
                });
                const product: any = response.data.product;
                setProduct({id: product.id, title: product.title, description: product.description, images: product.images});
            } catch (error : any) {
                toast({
                    title: "Uh oh...",
                    description: `Error fetching product info: ${error.response.data.message}`
                })
            }
        }


        getProduct().catch((e) => {
            console.log(e)
        });
    }, [])

    useEffect(() => {
        const getWishlist = async() => {
            try {
                if (user) {
                    const response = await axios.get("/api/wishlist/by/id", {
                        params: {
                            userId: user?._id
                        }
                    })
                    const wishlist = response.data.wishlist.map((product: any) =>  product.id);
                    setWishlist(wishlist)
                }
            } catch (error : any) {
                toast({
                    title: "Uh oh...",
                    description: `Error fetching data associated with user: ${error.response.data.error}`
                })
            }
        }

        getWishlist().catch((e) => {console.log(e)})
    }, [user])

    useEffect(() => {
        const getProductImportance = async () => {
            try {
                const response = await axios.get('/api/products/importance', {
                    params: {
                        productId: productId
                    }
                })

                setRelatedUsers(response.data.users);
            } catch (error: any) {
                toast({
                    title: "Uh oh...",
                    description: `Had a hard time finding users who like this product ${error.response.data.error}`
                })
            }
        }

        getProductImportance().catch((e) => console.log(e));
    }, [])

    return (
        <div className="h-full">
            <Header/>
            <Snowfall
                color="#D8E8EE"
                style={{ background: "224 71.4% 4.1%", zIndex: -1}}
                snowflakeCount={300}
            />
            <div key={refresh} className="flex flex-col justify-center items-center mt-5 h-full">
                <Card className="flex flex-col justify-center items-center w-4/5">
                    {
                        user !== null ? (wishlist.includes(productId) ? <Button className="mt-5 mr-5 self-end" variant="destructive" onClick={() => removeFromWishlist(productId)}>Remove from Wishlist</Button> : <Button className="mt-5 mr-5 self-end" onClick={() => addToWishlist(productId)}>Add to Wishlist</Button>) : 
                        <Link href="/login" className="mt-5 mr-5 self-end">
                            <Button>
                                Log in to use product.
                            </Button>
                        </Link>
                    }
                    {
                        product && 
                        <div className="w-4/5 flex flex-col justify-center items-center gap-4">
                            <CardTitle>{product.title}</CardTitle>
                            <Badge>{relatedUsers && <span>{`On ${relatedUsers.length} user's wishlist${relatedUsers.length === 1 ? "" : "s"} `}</span>}</Badge>
                            <CardDescription><p>{product.description}</p></CardDescription>
                            <ScrollArea className="mt-10 w-full whitespace-nowrap rounded-md border">
                                <div className="flex w-max space-x-4 p-4">
                                    {product.images.map((image, i) => (
                                    <figure key={i} className="shrink-0">
                                        <div className="overflow-hidden rounded-md w-full">
                                            <Image
                                                src={image}
                                                alt={`Photo of ${product.title}`}
                                                className="aspect-[3/4] h-fit w-fit object-cover"
                                                width={300}
                                                height={400}
                                            />
                                        </div>
                                    </figure>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            <h3 className="self-start mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Elves who want this item:</h3>
                            <ScrollArea className="mb-2 w-full whitespace-nowrap rounded-md border">
                                <div className="flex flex-row w-max space-x-4 p-4 justify-center items-center">
                                    {relatedUsers && relatedUsers.map((user: any) => {return (
                                        <Link href={`/profile/${user._id}`}>
                                            <div className="self-center flex flex-col justify-center items-center gap-3">
                                                <Avatar className="self-center w-45 h-45">
                                                    <AvatarFallback><CircleUserRound className="self-center" color="grey" strokeWidth={1} size={60}/></AvatarFallback>
                                                </Avatar>
                                                <Badge>{user.username}</Badge>
                                            </div>
                                        </Link>
                                    )})}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    }

                </Card>
            </div>
        </div>
    )
}