"use client"

import { Button } from "@/components/ui/button"
import Modal from "@/components/ui/modal"
import { useRoomIdContext } from "@/context/room-id-context"
import { generateRoomId } from "@/utils/server"
import { cn } from "@/utils/shadcn"
import { Frown, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import LoadingButton from "../buttons/LoadingButton"
import { useToast } from "@/hooks/use-toast"

type Props = {
    className?: string
}

function GenerateQrRoomModal({ className }: Props) {
    const router = useRouter()
    const { generatedRoomId, setGeneratedRoomId, generatedQR, setGeneratedQR } =
        useRoomIdContext()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [reGenerateFlag, setRegenerateFlag] = useState(false)

    useEffect(() => {
        async function generateRoomIdClient() {
            setErrorMessage(null)
            setIsLoading(true)
            try {
                const id = await generateRoomId()
                setGeneratedRoomId(id)
                const uri = await QRCode.toDataURL(
                    `http://localhost:3000/room/${id}`,
                )
                setGeneratedQR(uri)
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
    }, [reGenerateFlag])

    return (
        <Modal
            centerText
            className="items-center"
            open={isModalOpen}
            onOpenChange={async () => {
                if (isModalOpen) {
                    setIsModalOpen((prev) => !prev)
                }
            }}
            buttonCustom={
                <Button
                    onClick={() => {
                        setIsModalOpen((prev) => !prev)
                    }}
                    className={cn(className)}
                >
                    Create Room
                </Button>
            }
            title={`Test Room Creation`}
            desc={`Tell your partner to join the room to take on the test with you!`}
        >
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
                            {!isLoading && generatedRoomId && generatedQR ? (
                                <div className="flex flex-col justify-center">
                                    <div className="relative h-[280px] w-[280px] overflow-hidden">
                                        <img
                                            className="h-full w-full scale-[1.15]"
                                            alt="qrcode"
                                            src={generatedQR}
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
                <div className="flex gap-4">
                    <Button
                        className="flex-[1]"
                        onClick={() => {
                            setRegenerateFlag((prev) => !prev)
                        }}
                    >
                        Re-generate Room ID
                    </Button>
                    <LoadingButton
                        loading={isLoading}
                        disabled={!generatedRoomId}
                        className="flex-[1]"
                        onClick={() => {
                            router.push(`/room/${generatedRoomId}`)
                        }}
                    >
                        Join Test
                    </LoadingButton>
                </div>
            </div>
        </Modal>
    )
}

export default GenerateQrRoomModal
