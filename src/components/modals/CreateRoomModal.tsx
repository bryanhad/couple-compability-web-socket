"use client"

import LoadingButton from "@/components/buttons/LoadingButton"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { usePusherClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { createPusherClient } from "@/lib/pusher/client"
import { generateRandomId } from "@/utils/server"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"

const formSchema = z.object({
    displayName: z.string().min(3, {
        message: "Display name must be at least 3 characters.",
    }),
})

function CreateRoomModal() {
    const { setPusherClient, setUserInfo } = usePusherClientContext()
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: "",
        },
    })

    async function onSubmit({ displayName }: z.infer<typeof formSchema>) {
        setErrorMessage(null)
        setIsLoading(true)
        try {
            const newPusherClient = createPusherClient(displayName, toast, 'creator')
            setUserInfo({ displayName, role: "creator" })
            setPusherClient(newPusherClient)
            const id = generateRandomId()
            router.push(`/room/${id}`)
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
                        <p className="text-nowrap text-lg">Create Room</p>
                        <p className=" text-wrap text-primary-foreground/70">
                            Make the first move!
                        </p>
                    </div>
                </Button>
            }
            title={"Please enter your display name"}
            desc={"Your display name will be used for the compability result."}
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
                                Go To Room
                            </LoadingButton>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}

export default CreateRoomModal
