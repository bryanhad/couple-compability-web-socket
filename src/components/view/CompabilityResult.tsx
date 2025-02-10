"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"
import CountUp from "../animated-text/CountUp"
import { FORM_QUESTIONS } from "../forms/compability-form/form-data"
import { cn } from "@/utils/shadcn"
import { Heart, Check, X } from "lucide-react"
import { useEffect } from "react"

// Helper function to calculate match percentage
function calculateMatchPercentage(
    user1: Record<string, string>,
    user2: Record<string, string>,
): number {
    const keys = Object.keys(user1)
    const totalQuestions = keys.length
    let matches = 0

    keys.forEach((key) => {
        if (user1[key] === user2[key]) {
            matches++
        }
    })

    return Math.round((matches / totalQuestions) * 100) // Round to the nearest integer
}

const getMessage = (score: number) => {
    if (score === 100) return "Perfect Match! Just get married already! 🤭"
    if (score > 80) return "Wow! You're on the same wavelength! 🌟"
    if (score > 60) return "Great match! You've got a lot in common! 👍"
    if (score > 40) return "Not bad! You've got some common ground. 😊"
    if (score > 20) return "Well, opposites attract, right? 🤷‍♂️"
    return "Uh-oh! Time for a board game to break the ice? 🎲"
}

function CompabilityResult() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    const { userInfo, partnerInfo } = usePusherClientContext()

    // Ensure both userInfo and partnerInfo are present and have formValues
    if (!userInfo?.formValues || !partnerInfo?.formValues) {
        return <div>Loading compatibility results...</div>
    }

    const score = calculateMatchPercentage(
        userInfo.formValues,
        partnerInfo.formValues,
    )

    return (
        <div className="rounded-md border bg-white px-4 pb-4 pt-8">
            <div className="mb-4 flex flex-col items-center text-center">
                <h1 className="mb-4 text-3xl font-bold leading-none text-primary md:text-3xl">
                    Compability Results
                    <br />
                    Are In!
                </h1>

                <p className="text-muted-foreground">
                    Your compability with<br/>
                    <span className="font-semibold text-primary">
                        {partnerInfo.displayName}
                    </span>{" "}
                    is..
                </p>

                <div className="relative mb-14 mt-5">
                    <div
                        id="pulsingheartbig"
                        style={{ animation: "pulsingheart 1s infinite" }}
                    />
                    <p
                        className={cn(
                            "absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 text-6xl font-semibold text-red-500",
                            {
                                "text-orange-500": score > 20,
                                "text-yellow-600": score > 40,
                                "text-yellow-400": score > 60,
                                "text-green-400": score > 80,
                            },
                        )}
                    >
                        <CountUp to={score} />
                        <span>%</span>
                    </p>
                </div>

                <p className="max-w-[80%] text-gray-500">{getMessage(score)}</p>
            </div>

            <section>
                <h2 className="mb-3 text-center text-xl font-semibold">
                    Summary
                </h2>
                <li className="flex flex-col gap-4">
                    {Object.values(FORM_QUESTIONS)
                        .map((formField) => ({
                            question: formField.label,
                            user: {
                                name: "Mine",
                                answer:
                                    userInfo && userInfo.formValues
                                        ? userInfo.formValues[
                                              formField.fieldName
                                          ]
                                        : null,
                            },
                            partner: {
                                name: partnerInfo.displayName + `'s`,
                                answer:
                                    partnerInfo && partnerInfo.formValues
                                        ? partnerInfo.formValues[
                                              formField.fieldName
                                          ]
                                        : null,
                            },
                        }))
                        .map((formField, i) => {
                            const isMatch =
                                formField.user.answer ===
                                formField.partner.answer
                            return (
                                <ul
                                    className={cn(
                                        "rounded-lg bg-green-100 p-3",
                                        {
                                            "bg-red-100": !isMatch,
                                        },
                                    )}
                                    key={i}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="mb-2 font-medium text-gray-600">
                                            {formField.question}
                                        </p>
                                        {isMatch ? (
                                            <Check
                                                className="shrink-0 text-green-500"
                                                size={20}
                                            />
                                        ) : (
                                            <X
                                                className="shrink-0 text-red-500"
                                                size={20}
                                            />
                                        )}
                                    </div>
                                    <div className="flex">
                                        {[
                                            formField.user,
                                            formField.partner,
                                        ].map((el, i) => (
                                            <div
                                                key={i}
                                                className="flex flex-[1]"
                                            >
                                                <div className="flex flex-col">
                                                    <div className="flex flex-[1] items-center">
                                                        <Heart
                                                            className={cn(
                                                                "mr-2 shrink-0 text-blue-400",
                                                                {
                                                                    "text-red-400":
                                                                        el.name !==
                                                                        "Mine",
                                                                },
                                                            )}
                                                            size={14}
                                                        />
                                                    </div>
                                                    <div className="flex-[1]"></div>
                                                </div>
                                                <div>
                                                    <p
                                                        className={cn(
                                                            "font-semibold",
                                                            {
                                                                "": !isMatch,
                                                            },
                                                        )}
                                                    >
                                                        <span className="capitalize">
                                                            {el.name}
                                                        </span>
                                                    </p>

                                                    <p>{el.answer}</p>
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
