"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const DeleteUserFormSchema = z.object({
  id: z.string()
})

type DeleteUserFormValues = z.infer<typeof DeleteUserFormSchema>

export function DeleteUser() {
    const [users, setUsers] = useState<{_id: string, username: string, firstName: string, lastName: string, role: string}[]>([]);

    const form = useForm<DeleteUserFormValues>({
        resolver: zodResolver(DeleteUserFormSchema),
        mode: "onChange",
    })

    async function deleteUser(id: string) {
        try {

            const response = await axios.delete("/api/users/by/id", { data: {userId: id} })

            toast({
                title: "Elf deleted! Good riddance!",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(id, null, 2)}</code>
                    </pre>
                ),
            })
        } catch (error : any) {
            toast({
                title: "Error creating group",
                description: `Something went wrong: ${error.response.data.error}`
            })
        }
    }

    async function onSubmit(data: DeleteUserFormValues) {
        await deleteUser(data?.id);
    }

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get('/api/users');
                const users = response.data.users;
                setUsers(users);
            } catch (error: any) {
                toast({
                    title: "Uh oh! Something went wrong:",
                    description: `Error on fetching hosted groups ${error.response.data.error}`
                })
            }
        }
        getUserData().catch((e) => {
            console.log(e)
        });
    }, []);


    return (
        <div className="p-10">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User to Delete</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select which user you want to delete." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {   users &&
                                    users.length > 0 && 
                                    users.map((user) => {
                                        return (
                                            <SelectItem value={user._id}>{user.username}</SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="destructive">Delete User</Button>
            </form>
            </Form>
        </div>
    )
}