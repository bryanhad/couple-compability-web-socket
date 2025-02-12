"use client"

import { useClientContext } from "@/context/pusher-client-context"
import { useLayoutEffect } from "react"

function RefreshPusherClient() {
    const { setPusherClient, setUserInfo, setPartnerInfo, setChannelMemberCount, setSelectedQuestionKeys } = useClientContext()

    useLayoutEffect(() => {
        console.log("Resetting client state...")
        setPusherClient(null)
        setUserInfo(null)
        setPartnerInfo(null)
        setChannelMemberCount(1)
        setSelectedQuestionKeys([])
    }, [])

    return null
}

export default RefreshPusherClient
