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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useForm } from "react-hook-form"

const CreateGroupFormSchema = z.object({
  name: z.string(),
  description: z.string().max(200).min(4),
})

type CreateGroupFormValues = z.infer<typeof CreateGroupFormSchema>

export function CreateGroup() {
    const form = useForm<CreateGroupFormValues>({
        resolver: zodResolver(CreateGroupFormSchema),
        mode: "onChange",
    })

    async function createGroup(name: string, description: string) {
        try {
            let data: any = {
                name,
                description
            }

            const response = await axios.post("/api/groups", data)


            toast({
                title: "Group created! Looking forward to spreading some joy!",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            })
        } catch (error : any) {
            toast({
                title: "Error creating group",
                description: `Something went wrong: ${error.message}`
            })
        }
    }

    async function onSubmit(data: CreateGroupFormValues) {
        await createGroup(data?.name, data?.description);
    }

    return (
        <div className="p-10">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }: any) => (
                    <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Web Dev Secret Santa Group" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }: any) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="What should people know about the group? Any rules/themes?"
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" variant="default">Create Group</Button>
            </form>
            </Form>
        </div>
    )
}