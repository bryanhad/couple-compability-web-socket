"use server"

import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const JOIN_ROOM_EVENT: WSEvents = "join-room"

export async function triggerJoinRoomEvent(roomId: string, displayName: string | null) {
    await pusherServer.trigger(`private-${roomId}`, JOIN_ROOM_EVENT, displayName ?? 'your partner')
}
