"use client"

import { PropsWithChildren, useState } from "react"
import { RoomIdContext } from "./room-id-context"

function ContextProviders({ children }: PropsWithChildren) {
    const [generatedRoomId, setGeneratedRoomId] = useState("")
    const [generatedQR, setGeneratedQR] = useState("")
    return (
        <RoomIdContext.Provider
            value={{
                generatedRoomId,
                setGeneratedRoomId,
                generatedQR,
                setGeneratedQR,
            }}
        >
            {children}
        </RoomIdContext.Provider>
    )
}

export default ContextProviders
