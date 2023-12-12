"use client"

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios"
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export enum GroupListModes {
    SOME,
    ALL
}

type GroupListProps = {
    ids: string[],
    mode: GroupListModes
}

export default function GroupList(props: GroupListProps) {
    const [groupData, setGroupData] = useState<{_id: string, hostId: string, members: string[], name: string, description: string}[]>([])

    useEffect(() => {
        const getGroupData = async () => {
            try {
                if (props.mode === GroupListModes.SOME) {
                    const response = await axios.get('/api/groups/by/ids', {
                        params: {
                            groupIds: props.ids.join(',') 
                        }
                    });
                    const groups = response.data.groups;
                    setGroupData(groups);
                } else {
                    const response = await axios.get('/api/groups');
                    const groups = response.data.groups;
                    setGroupData(groups);
                }
                
            } catch (error: any) {
                toast({
                    title: "Something went wrong",
                    description: `Error on fetching gift exchange groups ${error.response.data.message}`
                })
            }
        }
        getGroupData().catch((e) => {
            console.log(e)
        });
    }, []);

    return (
        <Card className="flex flex-col justify-center items-center w-4/5 mt-4 p-4 mb-4">
            {
                groupData.map((group, i) => {
                    return (
                        <Link className="w-4/5" href={`/groups/${group._id}`} key={i}>
                            <Card className="w-full m-2">
                                <CardHeader className="flex flex-row justify-between items-start">
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
        </Card>
    );
}