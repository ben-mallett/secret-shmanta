"use client" 

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Snowfall from 'react-snowfall'
import axios from "axios";
import { useUser } from "@/components/user-provider"
 
export default function Register() {
    const { setUserState } = useUser();
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [role, setRole] = useState<string>("")
    const [credentials, setCredentials] = useState<{username: string, password: string}>({username: "", password: ""});
    const [confirmedPassword, setConfirmedPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const register = async () => {
        setLoading(true);
        try {
            if (confirmedPassword === credentials.password) {
                const response: any = await axios.post("/api/users/register", {...credentials, firstName, lastName, role});
                if (!response.data.error) {
                    router.push("/login");
                } else {
                    toast({
                        title: "Error registering account",
                        description: `${response.data.error}`
                    });
                }
            } else {
                toast({
                    title: "Passwords don't match",
                    description: "Check to make sure your passwords match before submitting!"
                });
                setCredentials({...credentials, password: ""});
            }
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: `Something went wrong with your login request.\n ${error.response.data.error}`,
            })
            setCredentials({username: "", password: ""});
        } finally {
            setLoading(false);
            setConfirmedPassword("");
        }
    };

    return (
        <div className="flex h-screen justify-center items-center">
            <Snowfall
                color="#D8E8EE"
                style={{ background: "224 71.4% 4.1%", zIndex: -1}}
                snowflakeCount={300}
            />
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Enlist in Santa's Workshop</CardTitle>
                    <CardDescription>Get ready to pass around the holiday spirit!</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid grid-cols-2 w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="e.g. Ben" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="e.g. Mallett" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                            </div>
                            <div className="flex flex-col space-y-1.5"> 
                                <Label htmlFor="role">Role</Label>
                                <Select onValueChange={(val) => {setRole(val)}}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectItem value="HOST">Group Host</SelectItem>
                                        <SelectItem value="PARTICIPANT">Participant</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="e.g. rudolph" value={credentials.username} onChange={(e) => setCredentials({username: e.target.value, password: credentials.password})}/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={credentials.password} onChange={(e) => setCredentials({username: credentials.username, password: e.target.value})}/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="passwordAgain">Repeat Password</Label>
                                <Input id="passwordAgain" type="password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}/>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col justify-center">
                    <div>
                        <Link href="/">
                            <Button className="m-3" variant="outline">Back</Button>
                        </Link>
                        <Button className="m-3" disabled={loading} onClick={register}>Register</Button>
                    </div>
                    <div className="small">
                        <Link href="login" style={{ textDecoration: 'underline' }} className="p-3">
                            <small className="text-sm font-medium leading-none">Already have an account? Log in here!</small>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}