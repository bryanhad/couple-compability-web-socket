"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { triggerJoinerJoinedRoomEvent } from "@/server-actions/trigger-joiner-joined-room-event"
import { WSEvents } from "@/utils/constants"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { CompabilityFormFields } from "../forms/compability-form/schema"
import WaitingPartnerToJoinView from "../view/WaitingPartnerToJoinView"
import { triggerCreatorHasBeenWaitingEvent } from "@/server-actions/trigger-creator-has-been-waiting-event"

type Props = PropsWithChildren & {
    currentRoomId: string
}

const JOINER_JOINED_ROOM_EVENT: WSEvents = "joiner-joined-room"
const CREATOR_HAS_BEEN_WAITING_EVENT: WSEvents = "creator-has-been-waiting"
const CREATOR_SUBMITTED_FORM_EVENT: WSEvents = "creator-submitted-form"
const JOINER_SUBMITTED_FORM_EVENT: WSEvents = "joiner-submitted-form"

function WaitingPartnerJoinFallback({ currentRoomId, children }: Props) {
    const { pusherClient, userInfo, setPartnerInfo, setUserInfo } =
        usePusherClientContext()
    const router = useRouter()

    const [isWaitingPartner, setIsWaitingPartner] = useState(true)

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    // USE EFFECT FOR THE "JOINER" AND THE "CREATOR"
    useEffect(() => {
        if (!pusherClient) {
            // if no pusherClient (e.g. the user refreshes the page..)
            router.push("/room")
        }

        async function triggerJoinRoom() {
            if (!userInfo) {
                return
            }
            setIsLoading(true)
            try {
                await triggerJoinerJoinedRoomEvent(
                    currentRoomId,
                    userInfo.displayName,
                )
            } catch (err) {
                let errMessage = ""
                if (err instanceof Error) {
                    errMessage = err.message
                }
                toast({
                    variant: "destructive",
                    title: "Oops!",
                    description: errMessage || "Something went wrong!",
                })
            } finally {
                setIsLoading(false)
            }
        }
        if (userInfo?.role === "joiner") {
            triggerJoinRoom()
        }
    }, [])

    // USE EFFECT FOR SUBSRIBINGG TO A CHANNEL AND BIND TO EVENT
    useEffect(() => {
        if (!pusherClient) {
            return
        }

        const channel = pusherClient.subscribe(`private-${currentRoomId}`)

        channel.bind(JOINER_JOINED_ROOM_EVENT, (partnerName: string) => {
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

        // const presenceChannel = pusherClient.subscribe(
        //     `presence-${currentRoomId}`,
        // ) as PresenceChannel
        // presenceChannel.bind(
        //     "pusher:subscription_succeeded",
        //     (members: unknown) => {
        //         console.log({ members })
        //     },
        // )

        return () => {
            channel.unbind()
            channel.unsubscribe()
        }
    }, [userInfo])

    if (userInfo?.role === "creator" && isWaitingPartner) {
        return <WaitingPartnerToJoinView currentRoomId={currentRoomId} />
    }

    return <>{children}</>
}

export default WaitingPartnerJoinFallback
