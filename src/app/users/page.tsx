"use client"

import Header from "@/components/header"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Snowfall from "react-snowfall";
import { UserListModes } from "@/components/user-list";
import UserList from "@/components/user-list";

export default function Groups() {
    const { toast } = useToast();
    const [userIds, setUserIds] = useState<string[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get("/api/users");
                const users = response.data.users;
                setUserIds([users.map((user: any) => user._id)])
            } catch (error : any) {
                toast({
                    title: "Error fetching elves",
                    description: `${error.response.data.message}`
                })
            }
        }

        getUsers().catch((e) => {
            console.log(e)
        });
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
                    <h1 className="m-5 scroll-m-20 text-4xl tracking-tight lg:text-5xl">All Elves</h1>
                    <p>Explore all the different elves focused on spreading holiday cheer! Click on an elf to see more information!</p>
                    {
                        userIds.length > 0 ?
                        <div className="w-4/5 flex flex-col justify-center items-center">
                            <UserList ids={userIds} mode={UserListModes.ALL}/>
                        </div> : 
                            <h2>Groups not found</h2>
                    }
                </Card>
            </div>
        </div>
    )
}