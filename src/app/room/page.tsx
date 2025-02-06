import GenerateQrRoomModal from "@/components/modals/GenerateQrRoomModal"
import JoinRoomByIdModal from "@/components/modals/JoinRoomByIdModal"

function RoomPage() {
    return (
        <div>
            <h1>Here is the game:</h1>
            <p>You can start by</p>
            <div className="flex items-center gap-4">
                <GenerateQrRoomModal />
                <JoinRoomByIdModal />
            </div>
        </div>
    )
}

export default RoomPage
