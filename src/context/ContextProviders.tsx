"use client"

import { PropsWithChildren, useState } from "react"
import { ClientContext, UserInfo } from "./pusher-client-context"
import Pusher from "pusher-js"

function ContextProviders({ children }: PropsWithChildren) {
    const [pusherClient, setPusherClient] = useState<Pusher | null>(null)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [partnerInfo, setPartnerInfo] = useState<UserInfo | null>(null)
    const [channelMemberCount, setChannelMemberCount] = useState<number>(1)
    const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<string[]>([])

    return (
        <ClientContext.Provider
            value={{
                pusherClient,
                setPusherClient,
                userInfo,
                setUserInfo,
                partnerInfo,
                setPartnerInfo,
                channelMemberCount,
                setChannelMemberCount,
                selectedQuestionKeys,
                setSelectedQuestionKeys,
            }}
        >
            {children}
        </ClientContext.Provider>
    )
}

export default ContextProviders
