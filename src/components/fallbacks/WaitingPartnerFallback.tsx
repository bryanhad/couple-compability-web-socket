"use client"

import { useToast } from "@/hooks/use-toast"
import { pusherClient } from "@/lib/pusher/client"
import { triggerJoinRoomEvent } from "@/server-actions/trigger-join-room-event"
import { ROOM_ROLE_KEY, WSEvents } from "@/utils/constants"
import { Frown, LoaderCircle } from "lucide-react"
import QRCode from "qrcode"
import { PropsWithChildren, useEffect, useRef, useState } from "react"

type Props = PropsWithChildren & {
    currentRoomId: string
}

const EVENT_NAME: WSEvents = "join-room"

function WaitingPartnerFallback({ currentRoomId, children }: Props) {
    const isCreatorRef = useRef(false) // Ref to track the latest isCreator state

    const [isWaitingPartner, setIsWaitingPartner] = useState(true)
    const [generatedRoomId, setGeneratedRoomId] = useState<string | null>(null)
    const [qrCodeURI, setQrCodeURI] = useState<string | null>(null)

    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function triggerJoinRoom() {
            setErrorMessage(null)
            setIsLoading(true)
            try {
                await triggerJoinRoomEvent(currentRoomId)
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
        // the "joiner" should not have a localStorage of the ROOM_ROLE_KEY,
        // even if the "joiner" has made a room before, which means the user has the key on the localStorage,
        // the localStorage's value should not has the same current room id..
        // which means the user is indeed a "joiner".
        const localStorageValue = localStorage.getItem(ROOM_ROLE_KEY)
        if (
            !localStorageValue ||
            localStorageValue.split("-")[1] !== currentRoomId
        ) {
            triggerJoinRoom()
        } else {
            isCreatorRef.current = true
        }
    }, [])

    useEffect(() => {
        const channel = pusherClient.subscribe(currentRoomId)

        channel.bind(EVENT_NAME, (hasJoined: boolean) => {
            toast({
                variant: "default",
                title: "Hooray!",
                description: isCreatorRef.current
                    ? "Your partner is connected to the room"
                    : "You have connected to the room",
            })
            console.log(`Partner has joined!`, hasJoined)
            setIsWaitingPartner(false)
        })
        return () => {
            channel.unbind()
            channel.unsubscribe()
        }
    }, [])

    useEffect(() => {
        async function generateRoomIdClient() {
            setErrorMessage(null)
            setIsLoading(true)
            try {
                setGeneratedRoomId(currentRoomId)
                const uri = await QRCode.toDataURL(
                    `http://localhost:3000/room/${currentRoomId}`,
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
        generateRoomIdClient()
    }, [])

    if (isWaitingPartner) {
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
                                {!isLoading && generatedRoomId && qrCodeURI ? (
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
                                                {generatedRoomId.toUpperCase()}
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
