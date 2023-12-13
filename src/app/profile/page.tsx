"use client"

import Header from "@/components/header"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react";
import { useUser } from "@/components/user-provider";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Snowfall from "react-snowfall";
import { CircleUserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GroupList, { GroupListModes } from "@/components/group-list";
import GiftList, { GiftListModes } from "@/components/gift-list";
import Gift from "@/models/giftModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Profile() {
    const { user, setUserState } = useUser();
    const { toast } = useToast();
    const [profileData, setProfileData] = useState<{id: string, bio: string, links: string[], group_ids: string[]}>({id: "", bio: "", links: [], group_ids: []})


    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get("/api/users/me");
                const user = response.data.user;
                setUserState(user);
            } catch (error : any) {
                toast({
                    title: "Something went wrong",
                    description: `Error fetching user data: ${error.response.data.message}`
                })
            }
        }

        const getProfileData = async () => {
            try {
                const response = await axios.get("/api/profile");
                const profile = response.data.profile;
                setProfileData(profile)
            } catch (error : any) {
                toast({
                    title: "Something went wrong",
                    description: `Error on fetching profile data: ${error.response.data.message}`
                })
            }
        }

        getUserData().catch((e) => {
            console.log(e)
        });
        getProfileData().catch((e) => {
            console.log(e)
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
            <div className="w-full h-full flex flex-row justify-center align-center">
                <Card className="m-5 w-full lg:w-3/4 xl:w-2/3 2xl:w-2/3 flex flex-col gap-4 justify-start">
                    <div className="flex flex-col self-center m-10 w-4/5">
                        <div className="flex flex-col justify-center items-center gap-3 w-full">
                            <Avatar className="self-center w-45 h-45">
                                <AvatarFallback><CircleUserRound className="self-center" color="grey" strokeWidth={1} size={60}/></AvatarFallback>
                            </Avatar>
                            <Badge variant="outline">{user?.role}</Badge>
                        </div>
                        <h1 className="self-center m-5 scroll-m-20 text-4xl tracking-tight lg:text-5xl">
                            {user?.username}
                        </h1>
                        <p className="self-center ">
                            {profileData?.bio}
                        </p>
                        <Link href={`/wishlists/${user?._id}`}  className="w-1/5 self-center mt-4">
                            <Button className="w-full font-bold">See Wishlist</Button>
                        </Link>
                        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Links</h3>
                        { profileData ? (profileData.links.length > 0 ? 
                            <ul className="mt-6 ml-6 list-disc [&>li]:mt-1">
                                {profileData?.links.map((link, i) => <li key={i}><Link href={link} style={{ textDecoration: 'underline' }}>{link}</Link></li>)}
                            </ul> : <p>No links associated with this elf!</p>)
                        : <p>Loading...</p>
                        }
                        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Groups</h3>
                        { profileData ? (profileData.group_ids.length > 0 ? 
                            <div className="flex flex-col justify-center items-center w-full">
                                {profileData !== null && profileData.group_ids.length > 0 && <GroupList ids={profileData.group_ids} mode={GroupListModes.SOME}/>}
                            </div> : <p>No groups associated with this elf!</p>)
                        : <p>Loading...</p>
                        }
                    </div>
                </Card>
            </div>
        </div>
    )
}