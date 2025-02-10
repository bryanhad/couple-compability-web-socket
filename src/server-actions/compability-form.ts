"use server"

import { FormLanguage } from "@/utils/constants"
import { EN_FORM_QUESTIONS } from "@/components/forms/compability-form/fields/en"
import { ID_FORM_QUESTIONS } from "@/components/forms/compability-form/fields/id"
import { CompabilityFormFields } from "@/components/forms/compability-form/schema"

export async function getRandomQuestionKeys(formLanguage: FormLanguage, count: number = 10): Promise<string[]> {
    const formQuestions = formLanguage === "EN" ? EN_FORM_QUESTIONS : ID_FORM_QUESTIONS

    const allKeys = Object.keys(formQuestions) // extract all the keys from the form questions obj
    return allKeys
        .sort(() => Math.random() - 0.5) // shuffle the keys randomly
        .slice(0, count) // get the first [count] keys from the shuffled keys
}

export async function getFormQuestions(formLanguage: FormLanguage, questionKeys: string[]) {
    const formQuestions = formLanguage === "EN" ? EN_FORM_QUESTIONS : ID_FORM_QUESTIONS

    const validKeys = Object.keys(formQuestions)

    const invalidKeys = questionKeys.filter((key) => !validKeys.includes(key))

    if (invalidKeys.length > 0) {
        throw new Error(`Invalid question keys found: ${invalidKeys.join(", ")}`)
    }

    // If all keys are valid, return the selected questions
    return questionKeys.map((key) => formQuestions[key as keyof typeof formQuestions])
}

// Helper function to calculate match percentage
function calculateMatchPercentage(user1: Record<string, string>, user2: Record<string, string>): number {
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

export async function getCompabilityResult({
    formLanguage,
    questionKeys,
    userFormValues,
    partner,
}: {
    formLanguage: FormLanguage
    questionKeys: string[]
    userFormValues: CompabilityFormFields
    partner: {
        name: string
        formValues: CompabilityFormFields
    }
}) {
    const formQuestions = await getFormQuestions(formLanguage, questionKeys)
    const score = calculateMatchPercentage(userFormValues, partner.formValues)
    const message = getMessage(score)

    const summary = formQuestions.map((el) => {
        const usersAnswer = el.options.find((o) => o.value === userFormValues[el.fieldName])?.label ?? null
        const partnersAnswer = el.options.find((o) => o.value === partner.formValues[el.fieldName])?.label ?? null

        return {
            emoji: el.emoji,
            question: el.label,
            user: {
                name: "Mine",
                answer: usersAnswer,
            },
            partner: {
                name: partner.name + `'s`,
                answer: partnersAnswer,
            },
            isMatch: usersAnswer === partnersAnswer,
        }
    })

    return { score, message, summary }
}
