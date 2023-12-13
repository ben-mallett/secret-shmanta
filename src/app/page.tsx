"use client"

import Header from "@/components/header";
import { useUser } from "@/components/user-provider";
import Snowfall from "react-snowfall";
import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/product-list";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function Home() {
  const { user } = useUser();
  const { toast } = useToast();
  const [productsOfTheDay, setProductsOfTheDay] = useState<any[]>([]);

  useEffect(() => {
    const getDailyProducts = async () => {
      try {
        const response = await axios.get(`/api/products/daily`);
        console.log(response);
        const products = response.data.products;

        setProductsOfTheDay(products)
      } catch (error : any) {
        toast({
          title: "Uh oh... something went wrong",
          description: `Failed to fetch daily products: ${error.response.data.error}`
        })
      }
    }

    getDailyProducts().catch((e) => {
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
      <div className="flex flex-col justify-center items-center gap-4 w-full mt-5">
        {
          user && user.username ? 
          <Card className="flex flex-col justify-center items-center p-5 gap-5">
            <CardTitle>
              Hey {user.username}!
            </CardTitle>
            <CardDescription>
              Looking to pick up where you left off? Here's some quick links to get you started!
            </CardDescription>
            <CardContent className="flex flex-row gap-4">
              <Link href="/profile">
                <Button>
                  Profile
                </Button>
              </Link>
              <Link href={`/wishlists/${user._id}`}>
                <Button>
                  Wishlist
                </Button>
              </Link>
              <Link href={`/settings`}>
                <Button>
                  Settings
                </Button>
              </Link>
            </CardContent>
          </Card> :
          <div></div>
        }
        <Card className="w-4/5 flex flex-col justify-center items-center">
          <CardTitle className="mt-5">
            Products of the Day
          </CardTitle>
          <CardDescription>
            Explore some hot new products!
          </CardDescription>
          <CardContent>
            {
              productsOfTheDay &&
              <ProductList products={productsOfTheDay}/>
            }
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
