"use client"

import { useChannelSubscription } from "@/hooks/use-channel-subscription"
import { useJoinRoom } from "@/hooks/use-join-room"
import { useNoPusherClientGuard } from "@/hooks/use-no-pusher-client-guard"
import { LoaderCircle } from "lucide-react"
import { PropsWithChildren } from "react"
import WaitingPartnerToJoinView from "../view/WaitingPartnerToJoinView"
import { usePusherClientContext } from "@/context/pusher-client-context"

type Props = PropsWithChildren & {
    currentRoomId: string
}

function WaitingPartnerJoinFallback({ currentRoomId, children }: Props) {
    const { pusherClient } = useNoPusherClientGuard()
    const { channelMemberCount, userInfo } = usePusherClientContext()
    const { isWaitingPartner } = useChannelSubscription(currentRoomId)
    const { isJoiningRoom } = useJoinRoom(currentRoomId)

    if (
        !pusherClient ||
        (userInfo?.role === "joiner" && channelMemberCount < 2)
    ) {
        return (
            <div>
                <LoaderCircle className="shrink-0 animate-spin" size={120} />
            </div>
        )
    }

    if (isWaitingPartner) {
        return <WaitingPartnerToJoinView currentRoomId={currentRoomId} />
    }

    if (isJoiningRoom) {
        return (
            <div>
                <LoaderCircle size={70} className="shrink-0 animate-spin" />
            </div>
        )
    }

    return <>{children}</>
}

export default WaitingPartnerJoinFallback
