"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useNoPusherClientGuard() {
    const { pusherClient } = usePusherClientContext()
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
