"use client"

import { CompabilityFormFields } from "@/components/forms/compability-form/schema"
import { FormLanguage } from "@/utils/constants"
import Pusher from "pusher-js"
import { createContext, Dispatch, SetStateAction, useContext } from "react"

type UserInfoBase = {
    displayName: string
    role: "creator" | "joiner"
    formValues?: CompabilityFormFields
}

type CreatorInfo = UserInfoBase & {
    role: "creator"
    selectedLanguage: FormLanguage
    questionCount?: number
}

type JoinerInfo = UserInfoBase & {
    role: "joiner"
    isValid: boolean
}

export type UserInfo = CreatorInfo | JoinerInfo

type ClientContext = {
    pusherClient: Pusher | null
    setPusherClient: Dispatch<SetStateAction<Pusher | null>>
    userInfo: UserInfo | null
    setUserInfo: Dispatch<SetStateAction<UserInfo | null>>
    partnerInfo: UserInfo | null
    setPartnerInfo: Dispatch<SetStateAction<UserInfo | null>>
    channelMemberCount: number
    setChannelMemberCount: Dispatch<SetStateAction<number>>
    selectedQuestionKeys: string[]
    setSelectedQuestionKeys: Dispatch<SetStateAction<string[]>>
}

export const ClientContext = createContext<ClientContext | null>(null)

export function useClientContext() {
    const clientContext = useContext(ClientContext)
    if (clientContext === null) {
        throw new Error("useClientContext must be used within a ClientContext Provider")
    }
    return clientContext
}
