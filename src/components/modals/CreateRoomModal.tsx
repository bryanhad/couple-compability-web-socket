"use client"

import LoadingButton from "@/components/buttons/LoadingButton"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { useClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { createPusherClient } from "@/lib/pusher/client"
import { FormLanguage, formLanguage } from "@/utils/constants"
import { generateRandomId } from "@/utils/server"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const formSchema = z.object({
    displayName: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    languageSelect: z
        .string({ required_error: "Select your preferred language to play" })
        .refine((val) => formLanguage.find((l) => l.short === val), "Language must be either EN or ID"),
    questionCount: z
        .string()
        .refine((val) => !isNaN(Number(val)), { message: "Question count must be a number." }) // Ensures it's a number
        .refine((val) => Number(val) >= 5, { message: "Question count must be greater than 5." }), // Ensure it's greater than 5
})

function CreateRoomModal() {
    const { setPusherClient, setUserInfo } = useClientContext()
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: "",
            languageSelect: "EN",
            questionCount: "10",
        },
    })

    async function onSubmit({ displayName, languageSelect, questionCount }: z.infer<typeof formSchema>) {
        setErrorMessage(null)
        setIsLoading(true)
        try {
            const newPusherClient = await createPusherClient(displayName)
            setUserInfo({
                displayName,
                role: "creator",
                selectedLanguage: languageSelect as FormLanguage,
                questionCount: Number(questionCount),
            })
            setPusherClient(newPusherClient)
            const id = await generateRandomId()
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
                    className="flex h-28 flex-[1] flex-col justify-center rounded-md py-4 text-center"
                >
                    <div className="flex flex-col gap-1">
                        <p className="text-nowrap text-lg">Create Room</p>
                        <p className="text-wrap text-primary-foreground/70">Make the first move!</p>
                    </div>
                </Button>
            }
            title={"Cupid needs your help! 🏹"}
            desc={
                <p>
                    Please enter your <span className="text-primary">name</span>
                    ,
                    <br />
                    your <span className="text-primary">preferred language</span> to play, and <br />
                    set the <span className="text-primary">question count</span>.
                </p>
            }
        >
            <div className="flex w-full flex-col gap-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Please enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"languageSelect"}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <div className="flex items-center justify-evenly">
                                        {/* <FormLabel className="mt-2 text-foreground/60">Language:</FormLabel> */}
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex items-center gap-1"
                                            >
                                                {formLanguage.map((l) => (
                                                    <FormItem key={l.short} className="flex items-center space-x-1 space-y-0 pl-1">
                                                        <FormControl>
                                                            <RadioGroupItem value={l.short} />
                                                        </FormControl>
                                                        <FormLabel className="p-2 font-normal">{l.long}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"questionCount"}
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                        <FormControl>
                                            <SelectTrigger className="justify-between gap-6">
                                                <SelectValue placeholder="10" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[
                                                { count: 5, desc: "Warm-up round! 🔥" },
                                                { count: 10, desc: "Let's see where this goes! 😏" },
                                                { count: 15, desc: "Getting serious now! 💡" },
                                                { count: 20, desc: "All in! no regrets. 💘" },
                                            ].map((el) => (
                                                <SelectItem key={el.count} value={`${el.count}`}>
                                                    {el.count}
                                                    <span className="text-gray-600/60"> - {el.desc}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-4">
                            <LoadingButton loading={isLoading} type="submit" className="w-full">
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
