"use server"

import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const JOINER_JOINED_ROOM_EVENT: WSEvents = "joiner-joined-room"

export type JoinerJoinedRoom_EventPayload = {
    joinerName: string
}

export async function triggerJoinerJoinedRoomEvent(
    roomId: string,
    eventPayload: JoinerJoinedRoom_EventPayload,
) {
    await pusherServer.trigger(
        `private-${roomId}`,
        JOINER_JOINED_ROOM_EVENT,
        eventPayload
    )
}
