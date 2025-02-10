"use server"

import { CompabilityFormFields } from "@/components/forms/compability-form/schema"
import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const CREATOR_SUBMITTED_FORM_EVENT: WSEvents = "creator-submitted-form"

export type CreatorSubmittedForm_EventPayload = {
    formValues: CompabilityFormFields
}

export async function triggerCreatorSubmittedFormEvent(
    roomId: string,
    eventPayload: CreatorSubmittedForm_EventPayload,
) {
    await pusherServer.trigger(
        `private-${roomId}`,
        CREATOR_SUBMITTED_FORM_EVENT,
        eventPayload,
    )
}
