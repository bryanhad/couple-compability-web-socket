"use server"

import crypto from "crypto"

/**
 * Returns a random string
 * - `(length / 2)` bytes × 2 characters per byte = `length` characters
 */
export async function generateRandomId(length = 6): Promise<string> {
    if (length < 2) {
        throw new Error("invalid length input for generateRandomId")
    }
    return crypto.randomBytes(length / 2).toString("hex")
}