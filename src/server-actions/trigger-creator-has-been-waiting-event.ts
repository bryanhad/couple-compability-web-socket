"use server"

import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const CREATOR_HAS_BEEN_WAITING_EVENT: WSEvents = "creator-has-been-waiting"

export async function triggerCreatorHasBeenWaitingEvent(
    roomId: string,
    displayName: string | null,
) {
    await pusherServer.trigger(
        `private-${roomId}`,
        CREATOR_HAS_BEEN_WAITING_EVENT,
        displayName ?? "your partner",
    )
}
