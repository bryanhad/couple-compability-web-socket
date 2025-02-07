import PusherClient from "pusher-js"

export const pusherClient = new PusherClient("134a81eb9806d5e473ea", {
    cluster: "ap1",
    authEndpoint: "/api/pusher-auth",
    authTransport: "ajax",
    auth: {
        headers: {
            "Content-Type": "application/json",
        },
    },
})
