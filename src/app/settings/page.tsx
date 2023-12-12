"use client"

import Header from "@/components/header"
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react";
import { useUser } from "@/components/user-provider";
import { Card } from "@/components/ui/card";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { ProfileForm } from "@/components/profile-form";
import Snowfall from 'react-snowfall'

export default function Settings() {
    const { user, setUserState } = useUser();
    const { toast } = useToast();
    const [profileData, setProfileData] = useState<{id: string, bio: string, links: string[], groups: string[]} | null>(null)


    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get("/api/users/me");
                const user = response.data.user;
                setUserState(user);
            } catch (error : any) {
                toast({
                    title: "Something went wrong",
                    description: `Error on fetching user data: ${error.response.data.message}`
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
        <div>
            <Header/>
            <Snowfall
                color="#D8E8EE"
                style={{ background: "224 71.4% 4.1%", zIndex: -1}}
                snowflakeCount={300}
            />
            <div className="w-full flex flex-row justify-start align-center">
                <SidebarNav userRole={user?.role as unknown as string}/>
                <Card className="m-10 w-full lg:w-3/4 xl:w-2/3 2xl:w-2/3">
                    <h1 className="ml-10 mt-10 scroll-m-20 text-4xl tracking-tight lg:text-5xl">
                        Update Profile
                    </h1>
                    <ProfileForm firstName={user?.firstName as unknown as string} lastName={user?.lastName as unknown as string} bio={profileData?.bio as unknown as string} urls={profileData?.links as unknown as string[]}/>
                </Card>
            </div>
        </div>
    )
} 