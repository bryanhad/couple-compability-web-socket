import { usePusherClientContext } from "@/context/pusher-client-context"
import { useToast } from "@/hooks/use-toast"
import { triggerJoinerJoinedRoomEvent } from "@/server-actions/trigger-joiner-joined-room-event"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function useTriggerJoinRoom(currentRoomId: string) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const { userInfo, pusherClient } = usePusherClientContext()
    const router = useRouter()

    async function triggerJoinRoom() {
        if (!pusherClient || !userInfo) {
            // if no pusherClient (e.g. the user refreshes the page..)
            router.push("/room")
            return
        }
        if (userInfo.role === "creator") {
            return
        }
        setIsLoading(true)
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
            setIsLoading(false)
        }
    }
    return { triggerJoinRoom, isLoading }
}
