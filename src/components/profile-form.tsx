"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

type ProfileFormProps = {
    firstName: string,
    lastName: string,
    bio: string,
    urls: string[]
}

const profileFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().max(200).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm(props: ProfileFormProps) {
    const defaultValues = {
        firstName: props.firstName,
        lastName: props.lastName,
        bio: props.bio,
        urls: props.urls?.map((url: string) => {return {value: url}})
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const { fields, append } = useFieldArray({
        name: "urls",
        control: form.control,
    })

    async function updateData(firstName: string, lastName: string, bio: string, urls: string[] | undefined) {
        try {
            let data: any = {
                firstName,
                lastName,
                bio,
                urls
            }

            const response = await axios.put("/api/profile", data)
            console.log(response);

            toast({
                title: "Updated your information!",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            })
        } catch (error : any) {
            console.log(error);
            toast({
                title: "Error updating data",
                description: "Something went wrong"
            })
        }
    }

    async function onSubmit(data: ProfileFormValues) {
        await updateData(data?.firstName, data?.lastName, data.bio, data.urls?.map((urlObj) => urlObj.value));
    }

    return (
        <div className="p-10">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }: any) => (
                    <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Santa" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }: any) => (
                    <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Claus" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="bio"
                render={({ field }: any) => (
                    <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Tell us a little bit about yourself to help out all the elves with their gift giving"
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div>
                {fields.map((field, index) => (
                    <FormField
                    control={form.control}
                    key={field.id}
                    name={`urls.${index}.value`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                            URLs
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                            Add links to your website, blog, or social media profiles.
                        </FormDescription>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ value: "" })}
                >
                    Add URL
                </Button>
                </div>
                <Button type="submit" variant="default">Update profile</Button>
            </form>
            </Form>
        </div>
    )
}