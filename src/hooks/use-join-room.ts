'use client'

import { usePusherClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { triggerJoinerJoinedRoomEvent } from "@/server-actions/trigger-joiner-joined-room-event"
import { useEffect, useRef, useState } from "react"

export function useJoinRoom(currentRoomId: string) {
    const { toast } = useToast()
    const [isJoiningRoom, setIsJoiningRoom] = useState(false)
    const { userInfo } = usePusherClientContext()
    const hasJoinedRef = useRef(false) // ✅ Prevent re-execution

    useEffect(() => {
        if (hasJoinedRef.current) return // ✅ Prevent running more than once
        hasJoinedRef.current = true

        async function triggerJoinRoom() {
            // if (!pusherClient || !userInfo) {
            //     // if no pusherClient (e.g. the user refreshes the page..)
            //     router.push("/room")
            //     return
            // }
            if (!userInfo || userInfo.role === "creator") {
                return
            }
            setIsJoiningRoom(true)
            try {
                await triggerJoinerJoinedRoomEvent(
                    currentRoomId,
                    userInfo.displayName,
                )
            } catch (err) {
                const errMessage =
                    err instanceof Error ? err.message : "Something went wrong!"
                toast({
                    variant: "destructive",
                    title: "Oops!",
                    description: errMessage,
                })
            } finally {
                setIsJoiningRoom(false)
            }
        }

        triggerJoinRoom()
    }, [])

    return { isJoiningRoom }
}
