"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "./user-provider"
import axios from "axios";
import { PUT } from "@/app/api/users/me/route"

export enum publicRoles {
    PARTICIPANT = "PARTICIPANT",
    HOST = "HOST",
    ADMIN = "ADMIN",
}

const accountFormSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  role: z.nativeEnum(publicRoles)
})

type AccountFormValues = z.infer<typeof accountFormSchema>


export function AccountForm() {
    const { user, setUserState } = useUser();

    const defaultValues: Partial<AccountFormValues> = {
        username: user?.username,
        role: user?.role as publicRoles
    }

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
        mode: "onChange",
    })

    async function updateData(username: string | undefined, password: string | undefined, role: publicRoles) {
        try {
            let data: any = {role: role}

            if (username) {
                data["username"] = username;
            }

            if (password) {
                data["password"] = password;
            }
            
            const response = await axios.put("/api/users/me", data)
            const updatedUser = response.data.user;
            if (updatedUser) {
                setUserState(updatedUser);
            }
            toast({
                title: "Account updated successfully",
                description: ""
            })
        } catch (error : any) {
            toast({
                title: "Error updating data",
                description: "Something went wrong"
            })
        }
    }

    async function onSubmit(data: AccountFormValues) {
        await updateData(data?.username, data?.password, data.role);
    }

    return (
        <div className="p-10">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="username"
                render={({ field }: any) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="santa" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is your public display name. It can be your real name or a
                        pseudonym. 
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }: any) => (
                    <FormItem>
                    <FormLabel>Update Password</FormLabel>
                    <FormControl>
                        <Input type="password" {...field}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="HOST">HOST</SelectItem>
                            <SelectItem value="PARTICIPANT">PARTICIPANT</SelectItem>
                            {user?.role === "ADMIN" && <SelectItem value="ADMIN">ADMIN</SelectItem>}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="default">Update profile</Button>
            </form>
            </Form>
        </div>
    )
}