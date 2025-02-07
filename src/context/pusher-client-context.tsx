"use client"

import Pusher from "pusher-js"
import { createContext, Dispatch, SetStateAction, useContext } from "react"

type PusherClientContext = {
    pusherClient: Pusher | null
    setPusherClient: Dispatch<SetStateAction<Pusher | null>>
    displayName: string | null
    setDisplayName: Dispatch<SetStateAction<string | null>>
}

export const PusherClientContext = createContext<PusherClientContext | null>(null)

export function usePusherClientContext() {
    const pusherClientContext = useContext(PusherClientContext)
    if (pusherClientContext === null) {
        throw new Error(
            "usePusherClientContext must be used within a PusherClientContext Provider",
        )
    }
    return pusherClientContext
}
