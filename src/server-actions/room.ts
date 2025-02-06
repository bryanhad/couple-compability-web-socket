"use server"

import { generateRoomId } from "@/utils/server"

export async function getRandomRoomId() {
    return generateRoomId()
}