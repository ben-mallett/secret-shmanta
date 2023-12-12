"use client" 

import * as React from "react"
import { useState } from "react";
import * as userClient from "@/lib/users/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Snowfall from "react-snowfall"
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"
import axios from "axios";
import { useUser } from "@/components/user-provider";
 
export default function Login() {
    const { setUserState } = useUser();
    const [credentials, setCredentials] = useState<{username: string, password: string}>({username: "", password: ""});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast()

    const login = async () => {
        setLoading(true);
        try {
            const response: any = await axios.post("/api/users/login", credentials);
            setUserState(response.data.user);
            router.push("/");
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: `${error.response.data.error}`,
            })
        } finally {
            setCredentials({username: "", password: ""});
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Snowfall
                color="#D8E8EE"
                style={{ background: '224 71.4% 4.1%', zIndex: -1}}
                snowflakeCount={300}
            />
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Log In</CardTitle>
                    <CardDescription>One step closer to giving the gift of happiness (and maybe socks...)</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="e.g. ElfOfTheMonth" value={credentials.username} onChange={(e) => setCredentials({username: e.target.value, password: credentials.password})}/>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={credentials.password} onChange={(e) => setCredentials({username: credentials.username, password: e.target.value})}/>
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col justify-center">
                    <div>
                        <Link href="/">
                            <Button className="m-3" variant="outline">Back</Button>
                        </Link>
                        <Button className="m-3" onClick={login} disabled={loading}>Log In</Button>
                    </div>
                    <div className="small">
                        <Link href="register" style={{ textDecoration: 'underline' }}>
                            <small className="text-sm font-medium leading-none">Need an account? Click here!</small>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}