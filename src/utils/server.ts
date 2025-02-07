import crypto from "crypto"

/**
 * Returns a random string of 32 characters
 * - 3 bytes × 2 characters per byte = 6 characters
 */
export async function generateRandomId(length = 6) {
    if (length < 2) {
        throw new Error("invalid length input for generateRandomId")
    }
    return crypto.randomBytes(length / 2).toString("hex")
}