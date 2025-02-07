"use server"

import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const EVENT_NAME: WSEvents = "join-room"

export async function triggerJoinRoomEvent(roomId: string) {
    await pusherServer.trigger(roomId, EVENT_NAME, true)
}
