import { useToast } from "@/hooks/use-toast"
import envClient from "@/utils/env-client"
import { generateRandomId } from "@/utils/server"
import PusherClient from "pusher-js"

export function createPusherClient(
    displayName: string,
    toast: ReturnType<typeof useToast>["toast"],
    role: "creator" | "joiner",
) {
    const newUserId = generateRandomId(32)
    const newPusherClient = new PusherClient(envClient.PUSHER_APP_KEY, {
        cluster: envClient.PUSHER_CLUSTER,
        userAuthentication: {
            endpoint: "/api/pusher-authenticate",
            transport: "ajax",
            params: { userId: newUserId, displayName },
        },
        channelAuthorization: {
            endpoint: "/api/pusher-authorize",
            transport: "ajax",
            params: { userId: newUserId, displayName },
        },
    })

    newPusherClient.signin()

    return newPusherClient
}
