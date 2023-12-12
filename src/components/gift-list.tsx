"use client"

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios"
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export enum GiftListModes {
    GIVER = "GIVER",
    RECIPIENT = "RECIPIENT"
}

type GiftListProps = {
    id: string;
    mode: GiftListModes;
}

export default function GiftList(props: GiftListProps) {
    const [giftData, setGiftData] = useState<{id: string, giverId: string, recipientId: string, productId: string, description: string}[]>([])

    useEffect(() => {
        const getGiftData = async () => {
            try {
                if (props.mode === GiftListModes.GIVER) {
                    const response = await axios.get('/api/gifts/by/giver', {
                        params: {
                            giver: props.id
                        }
                    });
                    const gifts = response.data.gifts;
                    setGiftData(gifts);
                } else {
                    const response = await axios.get('/api/gifts/by/recipient', {
                        params: {
                            recipient: props.id
                        }
                    })
                    const gifts = response.data.gifts;
                    setGiftData(gifts);
                }
    
            } catch (error: any) {
                toast({
                    title: "Something went wrong",
                    description: `Error on fetching gifts ${error.response.data.message}`
                })
            }
        }
        getGiftData().catch((e) => {
            console.log(e)
        });
    }, []);

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            {
                giftData.map((gift, i) => {
                    return (
                        <Card key={i} className="w-full m-4">
                            <CardHeader className="flex flex-row justify-between gap-10 items-start">
                                <div>
                                    <CardTitle>{gift.description}</CardTitle>
                                </div>
                            </CardHeader>
                        </Card>
                    )
                })
            }
        </div>
    );
}