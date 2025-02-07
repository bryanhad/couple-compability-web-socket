import { pusherServer } from "@/lib/pusher/server"
import { generateRandomId } from "@/utils/server"

export async function POST(req: Request) {
    const data = await req.text()
    const [socketId, channelName] = data
        .split("&")
        .map((str) => str.split("=")[1])

    const id = await generateRandomId(32)

    const presenceData = {
        user_id: id,
        user_data: { user_id: id },
    }

    const auth = pusherServer.authorizeChannel(
        socketId,
        channelName,
        presenceData,
    )

    return new Response(JSON.stringify(auth))
}
