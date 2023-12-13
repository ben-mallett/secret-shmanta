"use client"

import Header from "@/components/header"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Snowfall from "react-snowfall";
import { UserListModes } from "@/components/user-list";
import UserList from "@/components/user-list";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/user-provider";
import Link from "next/link";
import { revalidatePath } from 'next/cache'

export default function GroupPage() {
    const { toast } = useToast();
    const { setUserState, user } = useUser();
    const [group, setGroup] = useState<{id: string, name: string, description: string}>()
    const [userIds, setUserIds] = useState<string[]>([])
    const routeName = usePathname();
    const groupId = usePathname().split("/")[2]
    const router = useRouter();
    const [refresh, setRefresh] = useState<number>(0);

    const leaveGroup = async () => {
        try {
            const response = await axios.get("/api/groups/leave", {
                params: {
                    groupId: groupId
                }
            });
            toast({
                title: "Left group",
                description: "Come back soon!"
            })
            setUserIds([...userIds.filter((id) => id !== user?._id)])
            setRefresh(refresh + 1);
        } catch (error: any) {
            toast({
                title: "This is weird...",
                description: `Leaving the group failed: ${error.response.data.message}`
            })
        }
    }

    const joinGroup = async () => {
        try {
            const response = await axios.get("/api/groups/join", { params: {
                groupId: groupId
            }});
            toast({
                title: "Joined group!",
                description: "Looking forward to the cheer you'll spread!"
            })
            setUserIds([...userIds, user ? user._id : ""])
            setRefresh(refresh + 1);
        } catch (error: any) {
            toast({
                title: "This is weird...",
                description: `Joining the group failed: ${error.response.data.message}`
            })
        }
    }

    useEffect(() => {
        const getGroups = async () => {
            try {
                const response = await axios.get("/api/groups/by/id", { params: {
                    groupId: groupId
                }});
                const group: any = response.data.group;
                setGroup({id: group._id, name: group.name, description: group.description});
                setUserIds(group.members);
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

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get("/api/users", {
                    params: {
                        groupIds: userIds.join(',') 
                    }
                })
            } catch (error: any) {
                toast({
                    title: "Couldn't load elves in group",
                    description: `${error.response.data.message}`
                })
            }
        }

        if (userIds.length > 0) {
            getUsers().catch((e) => {
                console.log(e);
            })
        }
    }, [userIds])

    return (
        <div className="h-full">
            <Header/>
            <Snowfall
                color="#D8E8EE"
                style={{ background: "224 71.4% 4.1%", zIndex: -1}}
                snowflakeCount={300}
            />
            <div className="flex flex-col justify-center items-center mt-5">
                <Card className="flex flex-col justify-center items-center w-4/5">
                    {user !== null ? (userIds.includes(user._id) ? <Button className="mt-5 mr-5 self-end" variant="destructive" onClick={leaveGroup}>Leave Group</Button> : <Button className="mt-5 mr-5 self-end" onClick={joinGroup}>Join Group</Button>) : 
                        <Link href="/login" className="mt-5 mr-5 self-end">
                            <Button>
                                Log in to join group.
                            </Button>
                        </Link>}
                    {
                        group ?
                        <div className="flex flex-col justify-center items-center w-4/5">
                            <h1 className="m-5 scroll-m-20 text-4xl tracking-tight lg:text-5xl">{group.name}</h1>
                            <p className="self-center ">{group.description}</p>
                            <h3 className="self-start mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Members</h3>
                            {userIds.length > 0 && 
                                <UserList key={refresh} ids={userIds} mode={UserListModes.SOME}/>
                            }
                        </div>
                        :
                        <h1>Group not found</h1>
                    }
                </Card>
            </div>
        </div>
    )
}