"use client"

import { createContext, Dispatch, SetStateAction, useContext } from "react"

type RoomIdContext = {
    generatedRoomId: string | null
    setGeneratedRoomId: Dispatch<SetStateAction<string>>
    generatedQR: string | null
    setGeneratedQR: Dispatch<SetStateAction<string>>
}

export const RoomIdContext = createContext<RoomIdContext | null>(null)

export function useRoomIdContext() {
    const roomIdContext = useContext(RoomIdContext)
    if (roomIdContext === null) {
        throw new Error(
            "useRoomIdContext must be used within a RoomIdContext Provider",
        )
    }
    return roomIdContext
}
