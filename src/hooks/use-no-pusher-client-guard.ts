"use client"

import { useClientContext } from "@/context/pusher-client-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useNoPusherClientGuard() {
    const { pusherClient } = useClientContext()
    const router = useRouter()

    useEffect(() => {
        if (!pusherClient) {
            // if no pusherClient (e.g. the user refreshes the page..)
            router.push("/room")
            return
        }
    }, [])

    return { pusherClient }
}
