"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { useRouter } from "next/navigation"
import { useState } from "react"

function JoinRoomByIdModal() {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [input, setInput] = useState("")

    function handleClick() {
        router.push(`/room/${input}`)
    }

    return (
        <Modal
            centerText
            className="items-center"
            open={isModalOpen}
            onOpenChange={async () => {
                if (isModalOpen) {
                    setIsModalOpen((prev) => !prev)
                }
            }}
            buttonCustom={
                <Button
                    onClick={() => {
                        setIsModalOpen((prev) => !prev)
                    }}
                >
                    Join Room
                </Button>
            }
            title={"Enter Test Room ID"}
            desc={"Please enter the generated room ID from your partner."}
        >
            <div className="flex w-full flex-col gap-2">
                <Input
                    placeholder="123456"
                    type="text"
                    onChange={({ target }) => {
                        setInput(target.value)
                    }}
                />
                <Button onClick={handleClick}>Join Room</Button>
            </div>
        </Modal>
    )
}

export default JoinRoomByIdModal
