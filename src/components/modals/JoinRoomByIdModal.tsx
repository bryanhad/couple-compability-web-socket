"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import LoadingButton from "../buttons/LoadingButton"
import { createPusherClient } from "@/lib/pusher/client"
import { useToast } from "@/hooks/use-toast"
import { usePusherClientContext } from "@/context/pusher-client-context"

const formSchema = z.object({
    displayName: z.string().min(3, {
        message: "Display name must be at least 3 characters.",
    }),
    roomId: z.string().min(6, {
        message: "Room id must be at least 6 characters.",
    }),
})

function JoinRoomByIdModal() {
    const { setPusherClient, setUserInfo } = usePusherClientContext()
    const { toast } = useToast()
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: "",
            roomId: "",
        },
    })
    async function onSubmit({
        displayName,
        roomId,
    }: z.infer<typeof formSchema>) {
        setErrorMessage(null)
        setIsLoading(true)
        try {
            const newPusherClient = createPusherClient(displayName, toast)
            setPusherClient(newPusherClient)
            setUserInfo({ displayName, role: "joiner" })
            router.push(`/room/${roomId}`)
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
                    type="button"
                    onClick={() => {
                        setIsModalOpen((prev) => !prev)
                    }}
                    className="flex h-28 flex-[1] flex-col py-4 justify-center text-center"
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-nowrap text-lg">Join Room</p>
                        <p className="text-wrap text-primary-foreground/70">
                            Take your turn!
                        </p>
                    </div>
                </Button>
            }
            title={"Enter Test Room ID"}
            desc={
                "Please enter your desired display name and the generated room ID from your partner."
            }
        >
            <div className="flex w-full flex-col gap-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Bambang"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-4">
                            <LoadingButton
                                loading={isLoading}
                                type="submit"
                                className="w-full"
                            >
                                Join Room
                            </LoadingButton>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}

export default JoinRoomByIdModal
