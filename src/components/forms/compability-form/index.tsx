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
import { FORM_QUESTIONS } from "./form-data"
import { usePusherClientContext } from "@/context/pusher-client-context"
import { triggerCreatorSubmittedFormEvent } from "@/server-actions/trigger-creator-submitted-form-event"

type Props = {
    currentRoomId: string
}

function CompabilityForm({ currentRoomId }: Props) {
    const { userInfo, partnerInfo } = usePusherClientContext()
    const form = useForm<CompabilityFormFields>({
        resolver: zodResolver(compabilityFormSchema),
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
        <div className="w-full rounded-md border bg-white px-3 py-6">
            <div className="mb-5 text-center">
                <h1 className="mb-3 text-2xl font-bold leading-none text-primary md:text-3xl">
                    Time to Roll the Dice of Love!
                </h1>
                <p className="text-muted-foreground">
                    Let&apos;s see if you&apos;re on the same board as{" "}
                    <span className="font-semibold text-primary">
                        {partnerInfo
                            ? partnerInfo.displayName
                            : "your special someone"}
                    </span>
                    .. 👀
                </p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {Object.values(FORM_QUESTIONS).map((el) => (
                        <FormField
                            key={el.fieldName}
                            control={form.control}
                            name={el.fieldName}
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start rounded-md bg-pink-100/50 p-3">
                                    <FormLabel className="font-semibold">
                                        <div className="flex items-start gap-2">
                                            <div className="text-lg">
                                                {el.emoji}
                                            </div>
                                            <span className="leading-5">
                                                {el.label}
                                            </span>
                                        </div>
                                    </FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col gap-1"
                                        >
                                            {el.options.map((opt) => (
                                                <FormItem
                                                    key={opt.value}
                                                    className="flex items-center space-x-1 space-y-0 pl-1"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={opt.value}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="p-2 font-normal">
                                                        {opt.label}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
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
