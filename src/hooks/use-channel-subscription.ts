"use client"

import { useClientContext } from "@/context/pusher-client-context"
import {
    CreatorHasBeenWaiting_EventPayload,
    triggerCreatorHasBeenWaitingEvent,
} from "@/server-actions/trigger-creator-has-been-waiting-event"
import { CreatorSubmittedForm_EventPayload } from "@/server-actions/trigger-creator-submitted-form-event"
import { JoinerJoinedRoom_EventPayload, triggerJoinerJoinedRoomEvent } from "@/server-actions/trigger-joiner-joined-room-event"
import { JoinerSubmittedForm_EventPayload } from "@/server-actions/trigger-joiner-submitted-form-event"
import { WSEvents } from "@/utils/constants"
import { useRouter } from "next/navigation"
import { Channel, Members, PresenceChannel } from "pusher-js"
import { useEffect, useState } from "react"
import { useToast } from "./use-toast"

const JOINER_JOINED_ROOM_EVENT: WSEvents = "joiner-joined-room"
const CREATOR_HAS_BEEN_WAITING_EVENT: WSEvents = "creator-has-been-waiting"
const CREATOR_SUBMITTED_FORM_EVENT: WSEvents = "creator-submitted-form"
const JOINER_SUBMITTED_FORM_EVENT: WSEvents = "joiner-submitted-form"

export function useChannelSubscription(currentRoomId: string) {
    const PRESENCE_CHANNEL = `presence-${currentRoomId}`
    const ROOM_CHANNEL = `private-${currentRoomId}`

    const router = useRouter()
    const [roomChannel, setRoomChannel] = useState<Channel | null>(null)
    const {
        pusherClient,
        userInfo,
        partnerInfo,
        selectedQuestionKeys,
        setPartnerInfo,
        setUserInfo,
        setChannelMemberCount,
        setSelectedQuestionKeys,
        setPusherClient,
    } = useClientContext()
    const [isWaitingPartner, setIsWaitingPartner] = useState(true)

    const { toast } = useToast()

    useEffect(() => {
        if (!pusherClient) {
            return
        }

        const presenceChannel = pusherClient.subscribe(PRESENCE_CHANNEL) as PresenceChannel

        presenceChannel.bind("pusher:subscription_succeeded", async (members: Members) => {
            setChannelMemberCount(members.count)
            if (userInfo?.role === "joiner") {
                const isThirdWheeling = members.count >= 3
                const isAloneInRoom = members.count === 1

                if (isThirdWheeling || isAloneInRoom) {
                    toast({
                        variant: "destructive",
                        title: isAloneInRoom ? "Room not found!" : "Third wheel alert! ⚠️",
                        description: isAloneInRoom
                            ? "Are you sure the room ID is correct?"
                            : "This game is for two. No third wheels allowed.",
                    })
                    router.push("/room")
                    setUserInfo(null)
                    setPusherClient(null)
                    return
                }

                triggerJoinerJoinedRoomEvent(currentRoomId, {
                    joinerName: userInfo.displayName,
                })
            }
            setRoomChannel(pusherClient.subscribe(ROOM_CHANNEL))
        })

        return () => {
            presenceChannel.unbind()
            pusherClient.unsubscribe(PRESENCE_CHANNEL)
        }
    }, [])

    // CREATOR BINDS
    useEffect(() => {
        const isValidUser = userInfo?.role === "creator" && roomChannel
        if (!isValidUser) return

        roomChannel.bind(JOINER_JOINED_ROOM_EVENT, ({ joinerName }: JoinerJoinedRoom_EventPayload) => {
            toast({
                variant: "default",
                title: "Hooray!",
                description: `${joinerName} has joined your room!`,
            })
            setPartnerInfo({ displayName: joinerName, role: "joiner", isValid: true })
            triggerCreatorHasBeenWaitingEvent(currentRoomId, {
                creatorName: userInfo.displayName,
                selectedLanguage: userInfo.selectedLanguage,
                selectedQuestionKeys,
            })
            setIsWaitingPartner(false)
        })

        roomChannel.bind(JOINER_SUBMITTED_FORM_EVENT, ({ formValues: joinerAnswers }: JoinerSubmittedForm_EventPayload) => {
            toast({
                variant: "default",
                title: !!userInfo.formValues ? "Oh look!" : "Heads up!",
                description: `${partnerInfo?.displayName ?? "Your partner"} has submitted their form`,
            })
            setPartnerInfo((prev) => (prev ? { ...prev, formValues: joinerAnswers } : null))
        })

        return () => {
            if (isValidUser) {
                roomChannel.unbind()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomChannel, selectedQuestionKeys, partnerInfo, userInfo])

    // JOINER BINDS
    useEffect(() => {
        const isValidUser = userInfo?.role === "joiner" && roomChannel
        if (!isValidUser) return

        roomChannel.bind("pusher:subscription_succeeded", () => {
            toast({
                variant: "default",
                title: "Hooray!",
                description: "Successfully connected to room",
            })
            setUserInfo((prev) => (prev ? { ...prev, isValid: true } : null))
            setIsWaitingPartner(false)
        })

        return () => {
            if (isValidUser) {
                roomChannel.unbind()
            }
        }
    }, [roomChannel])

    useEffect(() => {
        const isValidUser = userInfo?.role === "joiner" && roomChannel && userInfo.isValid
        if (!isValidUser) return

        roomChannel.bind(
            CREATOR_HAS_BEEN_WAITING_EVENT,
            ({ creatorName, selectedLanguage, selectedQuestionKeys }: CreatorHasBeenWaiting_EventPayload) => {
                setPartnerInfo({
                    displayName: creatorName,
                    role: "creator",
                    selectedLanguage,
                })
                setSelectedQuestionKeys(selectedQuestionKeys)
            },
        )
        roomChannel.bind(CREATOR_SUBMITTED_FORM_EVENT, ({ formValues: creatorAnswers }: CreatorSubmittedForm_EventPayload) => {
            toast({
                variant: "default",
                title: !!userInfo.formValues ? "Oh look!" : "Heads up!",
                description: `${partnerInfo?.displayName ?? "Your partner"} has submitted their form`,
            })
            setPartnerInfo((prev) => (prev ? { ...prev, formValues: creatorAnswers } : null))
        })

        return () => {
            if (isValidUser) {
                roomChannel.unbind()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomChannel, partnerInfo, userInfo])

    return { isWaitingPartner }
}
