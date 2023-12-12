"use client"

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios"
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export enum UserListModes {
    SOME,
    ALL
}

type UserListProps = {
    ids: string[],
    mode: UserListModes
}

export default function UserList(props: UserListProps) {
    const [userData, setUserData] = useState<{_id: string, username: string, role: string}[]>([])

    useEffect(() => {
        const getUserData = async () => {
            try {
                if (props.mode === UserListModes.SOME) {
                    const response = await axios.get('/api/users/by/ids', {
                        params: {
                            userIds: props.ids.join(',') 
                        }
                    });
                    const users = response.data.users;
                    setUserData(users);
                } else {
                    const response = await axios.get('/api/users');
                    const users = response.data.users;
                    setUserData(users);
                }
                
            } catch (error: any) {
                toast({
                    title: "Uh oh... something messed up",
                    description: `Error on fetching users ${error.response.data.message}`
                })
            }
        }
        getUserData().catch((e) => {
            console.log(e)
        });
    }, []);

    return (
        <Card className="flex flex-col justify-center items-center w-full mb-4 mt-4 p-4">
            {userData && userData.length > 0 && 
                userData.map((user, i) => {
                    return (
                        <Link className="w-4/5" href={`/profile/${user._id}`} key={i}>
                            <Card className="w-full m-2">
                                <CardHeader className="flex flex-row justify-between items-start">
                                    <div>
                                        <CardTitle>{user.username}</CardTitle>
                                    </div>
                                    <Badge variant="outline">{user.role}</Badge>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })
            }
        </Card>
    );
}