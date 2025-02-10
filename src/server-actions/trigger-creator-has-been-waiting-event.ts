"use server"

import { pusherServer } from "@/lib/pusher/server"
import { FormLanguage, WSEvents } from "@/utils/constants"

const CREATOR_HAS_BEEN_WAITING_EVENT: WSEvents = "creator-has-been-waiting"

export type CreatorHasBeenWaiting_EventPayload = {
    creatorName: string
    selectedLanguage: FormLanguage
}

export async function triggerCreatorHasBeenWaitingEvent(
    roomId: string,
    eventPayload: CreatorHasBeenWaiting_EventPayload,
) {
    await pusherServer.trigger(
        `private-${roomId}`,
        CREATOR_HAS_BEEN_WAITING_EVENT,
        eventPayload,
    )
}
