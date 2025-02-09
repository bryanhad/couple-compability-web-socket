"use client"
/* eslint-disable @next/next/no-img-element */

import { useToast } from "@/hooks/use-toast"
import { Frown, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import QRCode from "qrcode"
import RippleText from "../animated-text/RippleText"
import { usePusherClientContext } from "@/context/pusher-client-context"

type Props = {
    currentRoomId: string
}

function WaitingPartnerToJoinView({ currentRoomId }: Props) {
    const { userInfo } = usePusherClientContext()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [qrCodeURI, setQrCodeURI] = useState<string | null>(null)

    useEffect(() => {
        async function generateRoomDetailsForPartner() {
            setErrorMessage(null)
            setIsLoading(true)
            try {
                const uri = await QRCode.toDataURL(
                    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/room/${currentRoomId}/on-boarding?cname=${userInfo?.displayName}`,
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
        generateRoomDetailsForPartner()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-col items-center">
            <RippleText
                text="Love is patient..."
                className="mb-2 text-nowrap text-4xl font-bold leading-none text-primary md:text-6xl"
            />
            <p className="text-muted-foreground">
                Waiting for your special someone...
            </p>
            {/* <h1 className="text-4xl font-bold leading-none text-primary md:text-6xl bounce">
                Love is patient..
            </h1> */}
            <div className="mt-2 w-full">
                <section className="flex h-[420px] items-center justify-center pb-3">
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
                                <div className="flex flex-col items-center justify-center rounded-md bg-white py-5 shadow-md">
                                    <p className="w-[70%] text-center text-sm text-foreground/60">
                                        Share this QR code with your partner to
                                        start the game!
                                    </p>
                                    <div className="relative h-[280px] w-[280px] overflow-hidden">
                                        <img
                                            className="h-full w-full scale-[1.15]"
                                            alt="qrcode"
                                            src={qrCodeURI}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center font-thin">
                                        <h2 className="text-sm">
                                            Or share this coom code:
                                        </h2>
                                        <p className="font-mono text-2xl font-semibold tracking-wider text-primary">
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

export default WaitingPartnerToJoinView
