"use server"

import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const SUBMIT_FORM_EVENT: WSEvents = "submit-form"

export async function triggerSubmitFormEvent(roomId: string, formInput: unknown) {
    await pusherServer.trigger(`private-${roomId}`, SUBMIT_FORM_EVENT, formInput)
}
