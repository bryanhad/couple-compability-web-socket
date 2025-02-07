"use client"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import LoadingButton from "@/components/buttons/LoadingButton"
import { ROOM_ROLE_KEY } from "@/utils/constants"
import { generateRandomId } from "@/utils/server"
import Modal from "@/components/ui/modal"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createPusherClient } from "@/lib/pusher/client"
import { usePusherClientContext } from "@/context/pusher-client-context"

const formSchema = z.object({
    displayName: z.string().min(3, {
        message: "Display name must be at least 3 characters.",
    }),
})

function CreateRoomModal() {
    const { setPusherClient, setDisplayName } = usePusherClientContext()
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
            const newPusherClient = createPusherClient(displayName, toast)
            setDisplayName(displayName)
            setPusherClient(newPusherClient)
            const id = generateRandomId()
            localStorage.setItem(ROOM_ROLE_KEY, `creator-${id}`)
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
                <LoadingButton
                    loading={isLoading}
                    type="button"
                    onClick={() => {
                        setIsModalOpen((prev) => !prev)
                    }}
                >
                    Create Room
                </LoadingButton>
            }
            title={"Please enter your display name"}
            desc={"Your display name will be used for the compability result."}
        >
            <div className="flex w-full flex-col gap-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
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
                        <LoadingButton loading={isLoading} type="submit">
                            Go To Room
                        </LoadingButton>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}

export default CreateRoomModal
