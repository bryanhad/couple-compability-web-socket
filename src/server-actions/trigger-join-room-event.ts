"use server"

import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const EVENT_NAME: WSEvents = "join-room"

export async function triggerJoinRoomEvent(roomId: string, displayName: string | null) {
    await pusherServer.trigger(`private-${roomId}`, EVENT_NAME, displayName ?? 'your partner')
}
