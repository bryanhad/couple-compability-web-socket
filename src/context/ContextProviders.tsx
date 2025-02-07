"use client"

import { PropsWithChildren, useState } from "react"
import { PusherClientContext } from "./pusher-client-context"
import Pusher from "pusher-js"

function ContextProviders({ children }: PropsWithChildren) {
    const [pusherClient, setPusherClient] = useState<Pusher | null>(null)
    const [displayName, setDisplayName] = useState<string | null>(null)
    return (
        <PusherClientContext.Provider
            value={{
                pusherClient,
                setPusherClient,
                displayName,
                setDisplayName,
            }}
        >
            {children}
        </PusherClientContext.Provider>
    )
}

export default ContextProviders
