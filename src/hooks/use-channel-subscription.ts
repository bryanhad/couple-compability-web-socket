"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"
import {
    CreatorHasBeenWaiting_EventPayload,
    triggerCreatorHasBeenWaitingEvent,
} from "@/server-actions/trigger-creator-has-been-waiting-event"
import { WSEvents } from "@/utils/constants"
import { useEffect, useState } from "react"
import { useToast } from "./use-toast"
import { PresenceChannel } from "pusher-js"
import { useRouter } from "next/navigation"
import { CreatorSubmittedForm_EventPayload } from "@/server-actions/trigger-creator-submitted-form-event"
import { JoinerSubmittedForm_EventPayload } from "@/server-actions/trigger-joiner-submitted-form-event"
import { JoinerJoinedRoom_EventPayload } from "@/server-actions/trigger-joiner-joined-room-event"

const JOINER_JOINED_ROOM_EVENT: WSEvents = "joiner-joined-room"
const CREATOR_HAS_BEEN_WAITING_EVENT: WSEvents = "creator-has-been-waiting"
const CREATOR_SUBMITTED_FORM_EVENT: WSEvents = "creator-submitted-form"
const JOINER_SUBMITTED_FORM_EVENT: WSEvents = "joiner-submitted-form"

export function useChannelSubscription(currentRoomId: string) {
    const router = useRouter()
    const {
        pusherClient,
        userInfo,
        partnerInfo,
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

        channel.bind(
            JOINER_JOINED_ROOM_EVENT,
            ({ joinerName }: JoinerJoinedRoom_EventPayload) => {
                setChannelMemberCount(presenceChannel.members.count)
                // creator block
                if (userInfo?.role === "creator") {
                    toast({
                        variant: "default",
                        title: "Hooray!",
                        description: `${joinerName} has joined your room!`,
                    })
                    setPartnerInfo({ displayName: joinerName, role: "joiner" })
                    triggerCreatorHasBeenWaitingEvent(currentRoomId, {
                        creatorName: userInfo.displayName,
                        selectedLanguage: userInfo.selectedLanguage,
                    })
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
            },
        )
        channel.bind(
            CREATOR_HAS_BEEN_WAITING_EVENT,
            ({
                creatorName,
                selectedLanguage,
            }: CreatorHasBeenWaiting_EventPayload) => {
                if (userInfo?.role === "joiner") {
                    setPartnerInfo({
                        displayName: creatorName,
                        role: "creator",
                        selectedLanguage,
                    })
                }
            },
        )

        channel.bind(
            CREATOR_SUBMITTED_FORM_EVENT,
            ({
                formValues: creatorAnswers,
            }: CreatorSubmittedForm_EventPayload) => {
                if (!userInfo) {
                    return
                }
                if (userInfo.role === "joiner") {
                    toast({
                        variant: "default",
                        title: !!userInfo.formValues ? "Oh look!" : "Heads up!",
                        description: `${partnerInfo?.displayName ?? "Your partner"} has submitted their form`,
                    })
                    setPartnerInfo((prev) =>
                        prev ? { ...prev, formValues: creatorAnswers } : null,
                    )
                } else {
                    setUserInfo((prev) =>
                        prev ? { ...prev, formValues: creatorAnswers } : null,
                    )
                }
            },
        )
        channel.bind(
            JOINER_SUBMITTED_FORM_EVENT,
            ({
                formValues: joinerAnswers,
            }: JoinerSubmittedForm_EventPayload) => {
                if (!userInfo) {
                    return
                }
                if (userInfo.role === "creator") {
                    toast({
                        variant: "default",
                        title: !!userInfo.formValues ? "Oh look!" : "Heads up!",
                        description: `${partnerInfo?.displayName ?? "Your partner"} has submitted their form`,
                    })
                    setPartnerInfo((prev) =>
                        prev ? { ...prev, formValues: joinerAnswers } : null,
                    )
                } else {
                    setUserInfo((prev) =>
                        prev ? { ...prev, formValues: joinerAnswers } : null,
                    )
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
