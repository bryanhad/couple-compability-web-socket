import { pusherServer } from "@/lib/pusher/server"
import { NextRequest } from "next/server"

type Param = {
    socket_id: string
    displayName: string
    userId: string
}

export async function POST(req: NextRequest) {
    const bodyString = await req.text()
    const { socket_id, displayName, userId } = Object.fromEntries(
        bodyString.split("&").map((el) => el.split("=")),
    ) as Record<keyof Param, string>

    const user = {
        id: userId,
        user_info: {
            displayName,
        },
        // watchlist: ["another_id_1", "another_id_2"],
    }
    const authResponse = pusherServer.authenticateUser(socket_id, user)
    return new Response(JSON.stringify(authResponse), { status: 200 })
}
