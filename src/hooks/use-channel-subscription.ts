"use client"

import { CompabilityFormFields } from "@/components/forms/compability-form/schema"
import { usePusherClientContext } from "@/context/pusher-client-context"
import { triggerCreatorHasBeenWaitingEvent } from "@/server-actions/trigger-creator-has-been-waiting-event"
import { WSEvents } from "@/utils/constants"
import { useEffect, useState } from "react"
import { useToast } from "./use-toast"
import { PresenceChannel } from "pusher-js"
import { useRouter } from "next/navigation"

const JOINER_JOINED_ROOM_EVENT: WSEvents = "joiner-joined-room"
const CREATOR_HAS_BEEN_WAITING_EVENT: WSEvents = "creator-has-been-waiting"
const CREATOR_SUBMITTED_FORM_EVENT: WSEvents = "creator-submitted-form"
const JOINER_SUBMITTED_FORM_EVENT: WSEvents = "joiner-submitted-form"

export function useChannelSubscription(currentRoomId: string) {
    const router = useRouter()
    const {
        pusherClient,
        userInfo,
        setPartnerInfo,
        setUserInfo,
        setChannelMemberCount,
    } = usePusherClientContext()
    const [isWaitingPartner, setIsWaitingPartner] = useState(true)

    const { toast } = useToast()
    useEffect(() => {
        if (!pusherClient) {
            return
        }

        const channel = pusherClient.subscribe(`private-${currentRoomId}`)

        const presenceChannel = pusherClient.subscribe(
            `presence-${currentRoomId}`,
        ) as PresenceChannel

        channel.bind(JOINER_JOINED_ROOM_EVENT, (partnerName: string) => {
            setChannelMemberCount(presenceChannel.members.count)

            // creator block
            if (userInfo?.role === "creator") {
                toast({
                    variant: "default",
                    title: "Hooray!",
                    description: `${partnerName} has joined your room!`,
                })
                setPartnerInfo({ displayName: partnerName, role: "joiner" })
                triggerCreatorHasBeenWaitingEvent(
                    currentRoomId,
                    userInfo.displayName,
                )
                // joiner block
            } else {
                if (presenceChannel.members.count < 2) {
                    toast({
                        variant: "destructive",
                        title: "Room not found!",
                        description: `Are you sure the room ID is correct?`,
                    })
                    router.push("/room")
                } else {
                    toast({
                        variant: "default",
                        title: "Hooray!",
                        description: "Successfully connected to room",
                    })
                }
            }
            setIsWaitingPartner(false)
        })
        channel.bind(CREATOR_HAS_BEEN_WAITING_EVENT, (creatorName: string) => {
            if (userInfo?.role === "joiner") {
                setPartnerInfo({ displayName: creatorName, role: "creator" })
            }
        })

        channel.bind(
            CREATOR_SUBMITTED_FORM_EVENT,
            ({
                creatorName,
                ...creatorAnswer
            }: CompabilityFormFields & { creatorName: string }) => {
                if (!userInfo) {
                    return
                }
                if (userInfo.role === "joiner") {
                    toast({
                        variant: "default",
                        title: !!userInfo.formValues ? "Oh look!" : "Heads up!",
                        description: `${creatorName} has submitted their form`,
                    })
                    setPartnerInfo({
                        displayName: creatorName,
                        role: "creator",
                        formValues: creatorAnswer,
                    })
                } else {
                    setUserInfo({
                        displayName: userInfo.displayName,
                        role: "creator",
                        formValues: creatorAnswer,
                    })
                }
            },
        )
        channel.bind(
            JOINER_SUBMITTED_FORM_EVENT,
            ({
                joinerName,
                ...joinerAnswer
            }: CompabilityFormFields & { joinerName: string }) => {
                if (!userInfo) {
                    return
                }
                if (userInfo.role === "creator") {
                    toast({
                        variant: "default",
                        title: !!userInfo.formValues ? "Oh look!" : "Heads up!",
                        description: `${joinerName} has submitted their form`,
                    })
                    setPartnerInfo({
                        displayName: joinerName,
                        role: "joiner",
                        formValues: joinerAnswer,
                    })
                } else {
                    setUserInfo({
                        displayName: userInfo.displayName,
                        role: "joiner",
                        formValues: joinerAnswer,
                    })
                }
            },
        )

        return () => {
            channel.unbind()
            channel.unsubscribe()
        }
        // userInfo depedency to update the state of the functions on the bind to use the most updated userInfo
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo])

    return { isWaitingPartner }
}
