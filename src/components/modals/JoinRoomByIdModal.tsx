"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Modal from "@/components/ui/modal"
import { useState } from "react"

function JoinRoomByIdModal() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [input, setInput] = useState("")

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
                <Input placeholder="123456" type="text" />
                <Button>Join Room</Button>
            </div>
        </Modal>
    )
}

export default JoinRoomByIdModal
