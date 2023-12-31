"use client"

import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { QuickLinks } from "./quick-links";
import { Separator } from "./ui/separator";
import { useEffect } from "react";
import axios from "axios"
import { useUser } from "./user-provider";
import { toast } from "./ui/use-toast";
import { usePathname } from "next/navigation";


export default function Header() {
    const { setUserState, user } = useUser();
    const path = usePathname();

    useEffect(() => { 
        const getAccount = async() => {
            try {
                if (!user) {
                    const response = await axios.get("/api/users/me");
                    const user = response.data.user
                    // update the provider with most up to date user data
                    setUserState(user);
                }
            } catch (error) {
                toast({
                    title: "Anonymous Mode",
                    description: "Currently in anonymous mode. Log in to get the full experience!"
                })
            }
        }
        
        getAccount();
    }, [user])

    return (
        <div>
            <nav
                className="sticky top-0 h-15 z-30 bg-background mx-auto border-muted"
                aria-label="Global"
            >
                <div className="h-20 px-4 lg:px-8 flex items-center justify-between space-y-0">
                    <Link href="/">
                        <h3 className="scroll-m-20 text-2xl font-extralight tracking-tight">
                            Secret Shmanta
                        </h3>
                    </Link>
                    <nav className="flex items-center space-x-4 lg:space-x-6">
                        <Link
                            href="/search"
                            className={`text-sm font-medium ${path.includes("/search") ? "" : "text-muted-foreground"} transition-colors hover:text-primary`}
                        >
                            Search Products
                        </Link>
                        <Link
                            href="/users"
                            className={`text-sm font-medium ${path.includes("/users") ? "" : "text-muted-foreground"} transition-colors hover:text-primary`}
                        >
                            Elves
                        </Link>
                        <Link
                            href="/groups"
                            className={`text-sm font-medium ${path.includes("/groups") ? "" : "text-muted-foreground"} transition-colors hover:text-primary`}
                        >
                            Groups
                        </Link>
                    </nav>
                    
                    <div className="flex justify-end items-center space-x-4">
                        <ModeToggle/>
                        {user !== null ? 
                            <QuickLinks/> :
                            <Link href="/login">
                                <Button>
                                    Log In
                                </Button>
                            </Link>}
                    </div>
                </div>
            </nav>
            <Separator/>
        </div>
    );
}