"use client"

import Header from "@/components/header"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import Snowfall from "react-snowfall";
import ProductList from "@/components/product-list";

export default function Wishlist() {
    const { toast } = useToast();
    const [wishlistInfo, setWishlistInfo] = useState<any>();
    const [userInfo, setUserInfo] = useState<any>();
    const userId = usePathname().split("/")[2]


    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get("/api/users/by/id", {
                    params: {
                        userId: userId
                    }
                })
                const user = response.data.user;
                setUserInfo(user);
            } catch (error : any) {
                toast({
                    title: "Error fetching user info",
                    description: `Something went wrong grabbing that data: ${error.response.data.error}`
                })
            }
        }

        const getWishlist = async () => {
            try {
                const response = await axios.get("/api/wishlist/by/id", {
                    params: {
                        userId: userId
                    }
                });
                const wishlist = response.data.wishlist;
                setWishlistInfo(wishlist)
            } catch (error : any) {
                toast({
                    title: "Error fetching wishlist",
                    description: `${error}`
                })
            }
        }

        getWishlist().catch((e) => {
            console.log(e);
        });
        getUser().catch((e) => {
            console.log(e);
        })
    }, [])

    return (
        <div className="h-full">
            <Header/>
            <Snowfall
                color="#D8E8EE"
                style={{ background: "224 71.4% 4.1%", zIndex: -1}}
                snowflakeCount={300}
            />
            <div className="flex flex-col justify-center items-center w-full">
                <Card className="flex flex-col justify-center items-center w-4/5 m-10">
                    <h1 className="m-5 scroll-m-20 text-4xl tracking-tight lg:text-5xl">{ userInfo && <span>{userInfo.username}'s</span>} wishlist</h1>
                    <p>Here's a list of items that they may want this holiday season</p>
                    {
                        wishlistInfo && wishlistInfo.length > 0?
                        <div key={wishlistInfo}>
                            <ProductList products={wishlistInfo}/>
                        </div> :  <h3 className="m-8 scroll-m-20 text-2xl font-semibold tracking-tight">This elf doesn't want any gifts (yet)</h3>
                    }
                </Card>
            </div>
        </div>
    )
}