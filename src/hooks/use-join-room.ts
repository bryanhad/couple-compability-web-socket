"use client"

import { useClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { triggerJoinerJoinedRoomEvent } from "@/server-actions/trigger-joiner-joined-room-event"
import { useEffect, useRef, useState } from "react"

export function useJoinRoom(currentRoomId: string) {
    const { toast } = useToast()
    const [isJoiningRoom, setIsJoiningRoom] = useState(false)
    const { userInfo } = useClientContext()
    const hasJoinedRef = useRef(false) // ✅ Prevent re-execution

    useEffect(() => {
        if (hasJoinedRef.current) return // ✅ Prevent running more than once
        hasJoinedRef.current = true

        async function triggerJoinRoom() {
            if (!userInfo || userInfo.role === "creator") {
                return
            }
            setIsJoiningRoom(true)
            try {
                await triggerJoinerJoinedRoomEvent(currentRoomId, {
                    joinerName: userInfo.displayName,
                })
            } catch (err) {
                const errMessage = err instanceof Error ? err.message : "Something went wrong!"
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
