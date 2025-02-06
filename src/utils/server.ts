"use server"

import crypto from "crypto"
import { setTimeout } from "timers/promises"

/**
 * Returns a random string of 32 characters
 * - 3 bytes × 2 characters per byte = 6 characters
 */
export async function generateRoomId() {
    await setTimeout(1000)
    return crypto.randomBytes(3).toString("hex")
}
