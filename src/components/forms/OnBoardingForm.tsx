"use client"

import LoadingButton from "@/components/buttons/LoadingButton"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { createPusherClient } from "@/lib/pusher/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
    roomId: string
}

const formSchema = z.object({
    displayName: z.string().min(3, {
        message: "Display name must be at least 3 characters.",
    }),
})

function OnBoardingForm({ roomId }: Props) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const { setPusherClient, setUserInfo } = useClientContext()

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
            const newPusherClient = await createPusherClient(displayName)
            setUserInfo({ displayName, role: "joiner", isValid: false })
            setPusherClient(newPusherClient)
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
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-[400px] rounded-md bg-white p-6 shadow-md">
            <h2 className="mb-3 text-muted-foreground">What&apos;s your name, love?</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <LoadingButton loading={isLoading} type="submit" className="rounded-full px-6">
                        Join Room
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}

export default OnBoardingForm
