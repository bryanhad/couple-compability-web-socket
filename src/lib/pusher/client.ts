import { useToast } from "@/hooks/use-toast"
import { generateRandomId } from "@/utils/server"
import PusherClient from "pusher-js"

export function createPusherClient(
    displayName: string,
    toast: ReturnType<typeof useToast>["toast"],
) {
    const newUserId = generateRandomId(32)
    const newPusherClient = new PusherClient("134a81eb9806d5e473ea", {
        cluster: "ap1",
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
        // authEndpoint: "/api/pusher-authorize",
        // authTransport: "ajax",
        // auth: {
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // },
    })

    newPusherClient.signin()
    newPusherClient.bind("pusher:signin_success", (data: unknown) => {
        toast({
            variant: "default",
            title: "Hooray!",
            description: "Successfully connected to room",
        })
    })

    return newPusherClient
}
