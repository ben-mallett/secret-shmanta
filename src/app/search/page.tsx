"use client"

import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import Snowfall from "react-snowfall";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState<string>("");
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
                        This is it...
                    </CardTitle>
                    <CardDescription>
                        The next best gift is one search away. Just type, click, and gift!
                    </CardDescription>
                    <CardContent className="w-full">
                        <div className="w-full flex items-center space-x-2 self-center mt-5">
                            <Input type="text" className="px-3 py-2 w-full" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                            <Link className="px-3 py-2 w-1/5" href={`/search/${searchQuery}`}>
                                <Button className="w-full" >Search</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>   
        </div>  
  )
}