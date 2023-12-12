"use client"

import Header from "@/components/header"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react";
import { useUser } from "@/components/user-provider";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Snowfall from "react-snowfall";
import GroupList, { GroupListModes } from "@/components/group-list";

export default function Groups() {
    const { toast } = useToast();
    const [groupIds, setGroupIds] = useState<string[]>([]);

    useEffect(() => {
        const getGroups = async () => {
            try {
                const response = await axios.get("/api/groups");
                const groups = response.data.groups;
                setGroupIds([groups.map((group: any) => group._id)])
            } catch (error : any) {
                toast({
                    title: "Error fetching groups",
                    description: `${error.response.data.message}`
                })
            }
        }

        getGroups().catch((e) => {
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
                    <h1 className="m-5 scroll-m-20 text-4xl tracking-tight lg:text-5xl">Giving Groups</h1>
                    <p>Explore all the different groups of elves focused on spreading holiday cheer! Click on a group to see more information!</p>
                    {
                        groupIds.length > 0 ?
                        <GroupList ids={groupIds} mode={GroupListModes.ALL}/> : 
                        <h2>Groups not found</h2>
                    }
                </Card>
            </div>
        </div>
    )
}