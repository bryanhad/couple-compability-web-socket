import { z } from "zod"

const envServerSchema = z.object({
    PUSHER_APP_ID: z.string(),
    PUSHER_APP_SECRET: z.string(),
})

// Parse and validate the environment variables
const envServer = envServerSchema.parse(process.env)

export default envServer
