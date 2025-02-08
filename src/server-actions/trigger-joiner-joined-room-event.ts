"use server"

import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const JOINER_JOINED_ROOM_EVENT: WSEvents = "joiner-joined-room"

export async function triggerJoinerJoinedRoomEvent(
    roomId: string,
    displayName: string | null,
) {
    await pusherServer.trigger(
        `private-${roomId}`,
        JOINER_JOINED_ROOM_EVENT,
        displayName ?? "your partner",
    )
}
