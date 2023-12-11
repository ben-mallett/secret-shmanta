"use client"

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios"
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type GroupListProps = {
    ids: string[]
}

export default function GroupList(props: GroupListProps) {
    const [groupData, setGroupData] = useState<{_id: string, hostId: string, members: string[], name: string, description: string}[]>([])

    useEffect(() => {
        const getGroupData = async () => {
            try {
                const response = await axios.get('/api/groups/by/ids', {
                    params: {
                        groupIds: props.ids.join(',') 
                    }
                });
                const groups = response.data.groups;
                setGroupData(groups);
            } catch (error: any) {
                toast({
                    title: "Something went wrong",
                    description: `Error on fetching gift exchange groups ${error.message}`
                })
            }
        }
        getGroupData().catch((e) => {
            console.log(e)
        });
    }, []);

    return (
        <div className="flex flex-col gap-4 justify-center items-center w-4/5">
            {
                groupData.map((group, i) => {
                    return (
                        <Link className="w-full" href={`/groups/${group._id}`} key={i}>
                            <Card className="w-full m-4">
                                <CardHeader className="flex flex-row justify-between gap-10 items-start">
                                    <div>
                                        <CardTitle>{group.name}</CardTitle>
                                        <CardDescription>{group.description}</CardDescription>
                                    </div>
                                    <Badge variant="outline">{group.members.length} member{group.members.length === 1 ? "" : "s"}</Badge>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })
            }
        </div>
    );
}