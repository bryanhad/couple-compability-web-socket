"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { useTriggerJoinRoom } from "@/hooks/use-trigger-join-room"
import { triggerCreatorHasBeenWaitingEvent } from "@/server-actions/trigger-creator-has-been-waiting-event"
import { WSEvents } from "@/utils/constants"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { CompabilityFormFields } from "../forms/compability-form/schema"
import WaitingPartnerToJoinView from "../view/WaitingPartnerToJoinView"

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
    const hasJoinedRef = useRef(false) // ✅ Prevent re-execution

    const { toast } = useToast()
    const { isLoading, triggerJoinRoom } = useTriggerJoinRoom(currentRoomId)

    useEffect(() => {
        if (hasJoinedRef.current) return // ✅ Prevent running more than once
        hasJoinedRef.current = true
        triggerJoinRoom()
    }, [triggerJoinRoom])

    // USE EFFECT FOR SUBSRIBINGG TO A CHANNEL AND BIND TO EVENT
    useEffect(() => {
        if (!pusherClient) {
            router.push("/room")
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

        return () => {
            channel.unbind()
            channel.unsubscribe()
        }
        // userInfo depedency to update the state of the functions on the bind to use the most updated userInfo
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo])

    if (userInfo?.role === "creator" && isWaitingPartner) {
        return <WaitingPartnerToJoinView currentRoomId={currentRoomId} />
    }

    if (isLoading) {
        return (
            <div>
                <LoaderCircle size={70} className="shrink-0 animate-spin" />
            </div>
        )
    }

    return <>{children}</>
}

export default WaitingPartnerJoinFallback
