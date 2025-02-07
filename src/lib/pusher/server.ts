import envClient from "@/utils/env-client"
import envServer from "@/utils/env-server"
import PusherServer from "pusher"

export const pusherServer = new PusherServer({
    appId: envServer.PUSHER_APP_ID,
    key: envClient.PUSHER_APP_KEY,
    secret: envServer.PUSHER_APP_SECRET,
    cluster: envClient.PUSHER_CLUSTER,
    useTLS: true,
})
