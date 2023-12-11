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

const DeleteGroupFormSchema = z.object({
  id: z.string()
})

type DeleteGroupFormValues = z.infer<typeof DeleteGroupFormSchema>

export function DeleteGroup() {
    const [groups, setGroups] = useState<{_id: string, host_id: string, members: string[], name: string, description: string}[]>([]);

    const form = useForm<DeleteGroupFormValues>({
        resolver: zodResolver(DeleteGroupFormSchema),
        mode: "onChange",
    })

    async function deleteGroup(id: string) {
        try {

            const response = await axios.delete("/api/groups/by/id")

            toast({
                title: "Group deleted! Sad to see it go...",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(id, null, 2)}</code>
                    </pre>
                ),
            })
        } catch (error : any) {
            console.log(error)
            toast({
                title: "Error creating group",
                description: `Something went wrong: ${error.response.data.error}`
            })
        }
    }

    async function onSubmit(data: DeleteGroupFormValues) {
        await deleteGroup(data?.id);
    }

    useEffect(() => {
        const getGroupData = async () => {
            try {
                const response = await axios.get('/api/groups/by/hostid');

                const groups = response.data.groups;
                console.log(groups);
                setGroups(groups);
            } catch (error: any) {
                console.log(error);
                toast({
                    title: "Uh oh! Something went wrong:",
                    description: `Error on fetching hosted groups ${error.response.data.error}`
                })
            }
        }
        getGroupData().catch((e) => {
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
                        <FormLabel>Group to Delete</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    groups.length > 0 && 
                                    groups.map((group) => {
                                        return (
                                            <SelectItem value={group._id}>{group.name}</SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="destructive">Delete Group</Button>
            </form>
            </Form>
        </div>
    )
}