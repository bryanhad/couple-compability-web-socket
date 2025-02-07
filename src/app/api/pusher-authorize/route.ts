import { pusherServer } from "@/lib/pusher/server"

type Param = {
    socket_id: string
    channel_name: string
    userId: string
    displayName: string
}

export async function POST(req: Request) {
    const bodyString = await req.text()
    const { socket_id, channel_name, userId, displayName } = Object.fromEntries(
        bodyString.split("&").map((el) => el.split("=")),
    ) as Record<keyof Param, string>

    const presenceData = {
        user_id: userId,
        user_info: { displayName },
    }
    const authResponse = pusherServer.authorizeChannel(
        socket_id,
        channel_name,
        presenceData,
    )

    return new Response(JSON.stringify(authResponse), { status: 200 })
}
