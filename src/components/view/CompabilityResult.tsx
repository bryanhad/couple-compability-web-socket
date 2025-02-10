"use client"

import { useClientContext } from "@/context/pusher-client-context"
import CountUp from "../animated-text/CountUp"
import { cn } from "@/utils/shadcn"
import { Check, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { getCompabilityResult } from "@/server-actions/compability-form"
import { useToast } from "@/hooks/use-toast"
import { FormLanguage } from "@/utils/constants"
import { useRouter } from "next/navigation"
import LoadingView from "./LoadingView"

type Props = {
    formLanguage: FormLanguage
}

function CompabilityResult({ formLanguage }: Props) {
    const { toast } = useToast()
    const router = useRouter()
    const hasFetchedResult = useRef(false)
    const { userInfo, partnerInfo, selectedQuestionKeys } = useClientContext()
    const [result, setResult] = useState<Awaited<ReturnType<typeof getCompabilityResult>> | null>(null)

    useEffect(() => {
        async function getResult() {
            if (
                !!userInfo?.formValues === false ||
                !!partnerInfo?.formValues === false ||
                selectedQuestionKeys.length < 1 ||
                hasFetchedResult.current
            )
                return

            window.scrollTo({ top: 0, behavior: "smooth" })
            hasFetchedResult.current = true
            try {
                const res = await getCompabilityResult({
                    formLanguage,
                    questionKeys: selectedQuestionKeys,
                    userFormValues: userInfo.formValues,
                    partner: { name: partnerInfo.displayName, formValues: partnerInfo.formValues },
                })
                setResult(res)
            } catch (err) {
                console.log(err)
                toast({ variant: "destructive", title: "Oh noose!", description: err instanceof Error ? err.message : "Something went wrong" })
                router.push("/room")
            }
        }
        getResult()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo, partnerInfo, selectedQuestionKeys])

    // result as the loading state haha
    if (!result) {
        return <LoadingView />
    }

    const { message, score, summary } = result

    return (
        <div className="rounded-md border bg-white/80 px-4 pb-4 pt-8">
            <div className="mb-4 flex flex-col items-center text-center">
                <h1 className="mb-2 text-3xl font-bold leading-10 text-primary md:text-3xl">
                    Compability Results
                    <br />
                    Are In!
                </h1>
                <div className="flex w-full flex-col items-center py-2">
                    <p className="text-muted-foreground">
                        Your compability with
                        <br />
                        <span className="font-semibold text-primary">{partnerInfo?.displayName}</span> is..
                    </p>

                    <div className="relative mb-16 mt-7">
                        <div id="pulsingheartbig" style={{ animation: "pulsingheart 1s infinite" }} />
                        <p
                            className={cn("absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 text-6xl font-semibold text-red-500", {
                                "text-orange-500": score > 20,
                                "text-yellow-500": score >= 40,
                                "text-yellow-400": score >= 60,
                                "text-green-400": score >= 80,
                                "text-white": score >= 0,
                            })}
                        >
                            <CountUp to={score} />
                            <span>%</span>
                        </p>
                    </div>
                    <div className="flex w-full justify-center rounded-full bg-primary/5 py-4 text-center">
                        <p className="max-w-[75%] text-lg text-primary/60">{message}</p>
                    </div>
                </div>
            </div>

            <section>
                <h2 className="mb-3 text-center text-xl font-semibold">Summary</h2>
                <li className="flex flex-col gap-4">
                    {summary.map((s, i) => {
                        return (
                            <ul
                                className={cn("rounded-lg bg-green-200 p-2 shadow", {
                                    "bg-red-200": !s.isMatch,
                                })}
                                key={i}
                            >
                                <div className="mb-2 flex items-start justify-between gap-3">
                                    <div className="mb-2 flex items-start gap-3">
                                        <div
                                            className={cn("rounded-md bg-green-100 text-lg", {
                                                "bg-red-100": !s.isMatch,
                                            })}
                                        >
                                            {s.emoji}
                                        </div>
                                        <span className="text-sm leading-5 text-gray-600">{s.question}</span>
                                    </div>
                                    {s.isMatch ? (
                                        <Check className="shrink-0 text-green-500" size={20} />
                                    ) : (
                                        <X className="shrink-0 text-red-500" size={20} />
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {[s.user, s.partner].map((el, i) => (
                                        <div key={i} className="flex flex-[1] gap-2">
                                            <div
                                                className={cn("rounded-md bg-green-100 p-2", {
                                                    "bg-red-100": !s.isMatch,
                                                })}
                                            >
                                                <p
                                                    className={cn("mb-1 text-sm font-semibold text-black/50", {
                                                        "text-green-500": el.name !== "Mine" && s.isMatch,
                                                        "text-red-500": el.name !== "Mine" && !s.isMatch,
                                                    })}
                                                >
                                                    <span className="capitalize">{el.name}</span>
                                                </p>

                                                <p className="text-sm tracking-wide text-black/40">{el.answer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ul>
                        )
                    })}
                </li>
            </section>
        </div>
    )
}

export default CompabilityResult
