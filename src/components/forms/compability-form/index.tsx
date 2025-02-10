"use client"

import LoadingButton from "@/components/buttons/LoadingButton"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { triggerCreatorSubmittedFormEvent } from "@/server-actions/trigger-creator-submitted-form-event"
import { triggerJoinerSubmittedFormEvent } from "@/server-actions/trigger-joiner-submitted-form-event"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CompabilityFormFields, generateCompabilityFormSchema } from "./schema"
import { FormQuestion } from "./type"

type Props = {
    currentRoomId: string
    formQuestions: FormQuestion[]
}

function CompabilityForm({ currentRoomId, formQuestions }: Props) {
    const { userInfo, partnerInfo, selectedQuestionKeys } = useClientContext()

    const dynamicSchema = generateCompabilityFormSchema(selectedQuestionKeys)

    const form = useForm<CompabilityFormFields>({
        resolver: zodResolver(dynamicSchema),
    })
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // ON SUBMIT
    async function onSubmit(formValues: CompabilityFormFields) {
        if (!userInfo) {
            return
        }
        setErrorMessage(null)
        setIsLoading(true)
        try {
            if (userInfo?.role === "creator") {
                await triggerCreatorSubmittedFormEvent(currentRoomId, {
                    formValues,
                })
            } else {
                await triggerJoinerSubmittedFormEvent(currentRoomId, {
                    formValues,
                })
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
        <div className="w-full rounded-md border bg-white/80 px-3 py-6">
            <div className="mb-5 text-center">
                <h1 className="mb-3 text-2xl font-bold leading-none text-primary md:text-3xl">Time to Roll the Dice of Love!</h1>
                <p className="text-muted-foreground">
                    Let&apos;s see if you&apos;re on the same board as{" "}
                    <span className="font-semibold text-primary">{partnerInfo ? partnerInfo.displayName : "your special someone"}</span>
                    .. 👀
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {formQuestions.map((el) => (
                        <FormField
                            key={el.fieldName}
                            control={form.control}
                            name={el.fieldName}
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start rounded-md p-3">
                                    <FormLabel className="w-full rounded-md bg-white/80 p-2 font-semibold">
                                        <div className="flex gap-2">
                                            <div className="flex flex-col">
                                                <div className="text-lg">{el.emoji}</div>
                                                <div className="flex-[1]" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="leading-5">{el.label}</p>
                                            </div>
                                        </div>
                                    </FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex w-full flex-col gap-2">
                                            {el.options.map((opt) => (
                                                <FormItem
                                                    key={opt.value}
                                                    className="flex items-center space-x-1 space-y-0 rounded-md bg-pink-300/30 pl-2"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem value={opt.value} />
                                                    </FormControl>
                                                    <FormLabel className="w-full p-2 text-sm">{opt.label}</FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                    <LoadingButton loading={isLoading} type="submit" className="w-full">
                        Submit Answer
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}

export default CompabilityForm
