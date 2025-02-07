"use client"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import LoadingButton from "./LoadingButton"
import { ROOM_ROLE_KEY } from "@/utils/constants"
import { generateRandomId } from "@/utils/server"

function CreateRoomButton() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    async function redirectToNewRoom() {
        setErrorMessage(null)
        setIsLoading(true)
        try {
            const id = await generateRandomId()
            localStorage.setItem(ROOM_ROLE_KEY, `creator-${id}`)
            router.push(`/room/${id}`)
        } catch (err) {
            if (err instanceof Error) {
                setErrorMessage(err.message)
            }
            toast({
                variant: "destructive",
                title: "Oops!",
                description: errorMessage || "Something went wrong!",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <LoadingButton
            loading={isLoading}
            type="button"
            onClick={redirectToNewRoom}
        >
            Create Room
        </LoadingButton>
    )
}

export default CreateRoomButton
