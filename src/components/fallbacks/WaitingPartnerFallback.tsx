"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { triggerJoinRoomEvent } from "@/server-actions/trigger-join-room-event"
import { ROOM_ROLE_KEY, WSEvents } from "@/utils/constants"
import { Frown, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { PresenceChannel } from "pusher-js"
import QRCode from "qrcode"
import { PropsWithChildren, useEffect, useRef, useState } from "react"

type Props = PropsWithChildren & {
    currentRoomId: string
}

const EVENT_NAME: WSEvents = "join-room"

function WaitingPartnerFallback({ currentRoomId, children }: Props) {
    const { pusherClient, displayName } = usePusherClientContext()
    const router = useRouter()
    const isCreatorRef = useRef(false) // Ref to track the latest isCreator state
    const hasTriggeredJoinRoom = useRef(false) // Ref to track  if join room has ran (for multiple run on dev mode)

    const [isWaitingPartner, setIsWaitingPartner] = useState(true)
    const [qrCodeURI, setQrCodeURI] = useState<string | null>(null)

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // USE EFFECT FOR THE "JOINER" OR THE "CREATOR"
    useEffect(() => {
        if (!pusherClient) {
            // if no pusherClient (e.g. the user refreshes the page..)
            router.push("/room")
        }
        if (hasTriggeredJoinRoom.current) {
            return
        }
        hasTriggeredJoinRoom.current = true

        async function triggerJoinRoom() {
            setErrorMessage(null)
            setIsLoading(true)
            try {
                console.log("Triggering join-room event...")
                await triggerJoinRoomEvent(currentRoomId, displayName)
            } catch (err) {
                console.error("Error triggering join-room:", err)
                if (err instanceof Error) {
                    setErrorMessage(err.message)
                }
                toast({
                    variant: "destructive",
                    title: "Oops!",
                    description: errorMessage || "Something went wrong!",
                })
            } finally {
                setIsLoading(false)
            }
        }

        // the "joiner" should not have a localStorage of the ROOM_ROLE_KEY,
        // even if the "joiner" has made a room before, which means the user has the key on the localStorage,
        // the localStorage's value should not has the same current room id..
        // which means the user is indeed a "joiner".
        const localStorageValue = localStorage.getItem(ROOM_ROLE_KEY)
        if (
            !localStorageValue ||
            localStorageValue.split("-")[0] !== "creator"
        ) {
            // THIS IS FOR THE "JOINER"
            triggerJoinRoom()
        } else {
            // THIS IS FOR THE "CREATOR"
            isCreatorRef.current = true
        }
    }, [])

    // USE EFFECT FOR AUTHENTICATE USER, AND SUBSRIBE TO A CHANNEL
    useEffect(() => {
        if (!pusherClient) {
            return
        }

        const channel = pusherClient.subscribe(`private-${currentRoomId}`)
        channel.bind(EVENT_NAME, (partnerName: boolean) => {
            if (isCreatorRef.current) {
                toast({
                    variant: "default",
                    title: "Hooray!",
                    description: `${partnerName} has joined your room!`,
                })
            }
            setIsWaitingPartner(false)
        })

        const presenceChannel = pusherClient.subscribe(
            `presence-${currentRoomId}`,
        ) as PresenceChannel
        presenceChannel.bind(
            "pusher:subscription_succeeded",
            (members: unknown) => {
                console.log({ members })
            },
        )

        return () => {
            channel.unbind()
            channel.unsubscribe()
        }
    }, [])

    // USE EFFECT FOR THE CREATOR (set qr-code and room id)
    useEffect(() => {
        async function generateRoomDetailsForPartner() {
            setErrorMessage(null)
            setIsLoading(true)
            try {
                const uri = await QRCode.toDataURL(
                    `http://localhost:3000/room/${currentRoomId}/on-boarding`,
                )
                setQrCodeURI(uri)
            } catch (err) {
                if (err instanceof Error) {
                    setErrorMessage(err.message)
                }
                toast({
                    variant: "destructive",
                    title: "Oops!",
                    description: errorMessage || "Something went wrong!",
                })
            } finally {
                setIsLoading(false)
            }
        }
        if (isCreatorRef.current === true) {
            generateRoomDetailsForPartner()
        }
    }, [])

    if (isCreatorRef.current && isWaitingPartner) {
        return (
            <div>
                Waiting for your partner to join the room...
                <div className="w-full">
                    <section className="flex h-[350px] items-center justify-center pb-3">
                        {errorMessage ? (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <Frown size={120} className="shrink-0" />
                                <h2 className="text-center text-xl">
                                    Something went wrong
                                </h2>
                            </div>
                        ) : (
                            <>
                                {!isLoading && qrCodeURI ? (
                                    <div className="flex flex-col justify-center">
                                        <div className="relative h-[280px] w-[280px] overflow-hidden">
                                            <img
                                                className="h-full w-full scale-[1.15]"
                                                alt="qrcode"
                                                src={qrCodeURI}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center font-thin">
                                            <h2>Room ID</h2>
                                            <p className="text-xl font-semibold">
                                                {currentRoomId.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <LoaderCircle
                                            size={70}
                                            className="shrink-0 animate-spin"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

export default WaitingPartnerFallback
