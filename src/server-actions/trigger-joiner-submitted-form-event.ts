"use server"

import { CompabilityFormFields } from "@/components/forms/compability-form/schema"
import { pusherServer } from "@/lib/pusher/server"
import { WSEvents } from "@/utils/constants"

const JOINER_SUBMITTED_FORM_EVENT: WSEvents = "joiner-submitted-form"

export async function triggerJoinerSubmittedFormEvent(
    roomId: string,
    joinerName: string,
    joinerFormValues: CompabilityFormFields,
) {
    await pusherServer.trigger(
        `private-${roomId}`,
        JOINER_SUBMITTED_FORM_EVENT,
        { joinerName, ...joinerFormValues },
    )
}
