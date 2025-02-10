"use client"

import { FormQuestion } from "@/components/forms/compability-form/type"
import { useClientContext } from "@/context/pusher-client-context"
import { getFormQuestions } from "@/server-actions/compability-form"
import { useEffect, useRef, useState } from "react"
import { useToast } from "./use-toast"
import { useRouter } from "next/navigation"

export function useGetFormQuestions() {
    const { toast } = useToast()
    const router = useRouter()
    const { userInfo, partnerInfo, selectedQuestionKeys } = useClientContext()
    const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([])

    const selectedLanguage =
        userInfo?.role === "joiner" && partnerInfo?.role === "creator"
            ? partnerInfo.selectedLanguage
            : userInfo?.role === "creator"
              ? userInfo.selectedLanguage
              : "EN" // Just for TypeScript safety!

    const hasFetchedFormQuestions = useRef(false) // Prevent re-execution

    useEffect(() => {
        if (selectedQuestionKeys.length < 1 || hasFetchedFormQuestions.current) return // Prevent running more than once
        hasFetchedFormQuestions.current = true

        async function getQuestions() {
            try {
                const questions = await getFormQuestions(selectedLanguage, selectedQuestionKeys)
                setFormQuestions(questions)
            } catch (err) {
                console.log(err)
                toast({ variant: "destructive", title: "Oh noose!", description: err instanceof Error ? err.message : "Something went wrong" })
                router.push("/room")
            }
        }
        getQuestions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedQuestionKeys])

    return { selectedLanguage, formQuestions }
}
