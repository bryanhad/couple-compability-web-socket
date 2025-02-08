"use client"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { triggerJoinerSubmittedFormEvent } from "@/server-actions/trigger-joiner-submitted-form-event"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import LoadingButton from "@/components/buttons/LoadingButton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CompabilityFormFields, compabilityFormSchema } from "./schema"
import { favBoardGames, favColors, favFoods } from "./form-data"
import { usePusherClientContext } from "@/context/pusher-client-context"
import { triggerCreatorSubmittedFormEvent } from "@/server-actions/trigger-creator-submitted-form-event"

type Props = {
    currentRoomId: string
}

function CompabilityForm({ currentRoomId }: Props) {
    const { userInfo } = usePusherClientContext()
    const form = useForm<CompabilityFormFields>({
        resolver: zodResolver(compabilityFormSchema),
        defaultValues: {
            favBoardGame: undefined,
            favColor: undefined,
            favFood: undefined,
        },
    })
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // ON SUBMIT
    async function onSubmit(values: CompabilityFormFields) {
        if (!userInfo) {
            return
        }
        setErrorMessage(null)
        setIsLoading(true)
        try {
            if (userInfo?.role === "creator") {
                await triggerCreatorSubmittedFormEvent(
                    currentRoomId,
                    userInfo.displayName,
                    values,
                )
            } else {
                await triggerJoinerSubmittedFormEvent(
                    currentRoomId,
                    userInfo.displayName,
                    values,
                )
            }
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
        <div className="w-full rounded-md bg-white px-6 py-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="favColor"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start gap-2">
                                <FormLabel>
                                    What&apos;s your favorite color?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {favColors.map((c) => (
                                            <FormItem
                                                key={c.value}
                                                className="flex items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={c.value}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {c.label}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="favFood"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start gap-2">
                                <FormLabel>
                                    What&apos;s your favorite food?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {favFoods.map((f) => (
                                            <FormItem
                                                key={f.value}
                                                className="flex items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={f.value}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {f.label}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="favBoardGame"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start gap-2">
                                <FormLabel>
                                    What&apos;s your favorite board game?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {favBoardGames.map((b) => (
                                            <FormItem
                                                key={b.value}
                                                className="flex items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={b.value}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {b.label}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <LoadingButton
                        loading={isLoading}
                        type="submit"
                        className="w-full"
                    >
                        Submit Answer
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}

export default CompabilityForm
