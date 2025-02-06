import PusherServer from "pusher"

export const pusherServer = new PusherServer({
    appId: "1937535",
    key: "134a81eb9806d5e473ea",
    secret: "615de76571a5eabc922e",
    cluster: "ap1",
    useTLS: true,
})

