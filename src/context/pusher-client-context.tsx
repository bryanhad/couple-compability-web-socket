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
}

type JoinerInfo = UserInfoBase & {
    role: "joiner"
}

export type UserInfo = CreatorInfo | JoinerInfo

type PusherClientContext = {
    pusherClient: Pusher | null
    setPusherClient: Dispatch<SetStateAction<Pusher | null>>
    userInfo: UserInfo | null
    setUserInfo: Dispatch<SetStateAction<UserInfo | null>>
    partnerInfo: UserInfo | null
    setPartnerInfo: Dispatch<SetStateAction<UserInfo | null>>
    channelMemberCount: number
    setChannelMemberCount: Dispatch<SetStateAction<number>>
}

export const PusherClientContext = createContext<PusherClientContext | null>(
    null,
)

export function usePusherClientContext() {
    const pusherClientContext = useContext(PusherClientContext)
    if (pusherClientContext === null) {
        throw new Error(
            "usePusherClientContext must be used within a PusherClientContext Provider",
        )
    }
    return pusherClientContext
}
