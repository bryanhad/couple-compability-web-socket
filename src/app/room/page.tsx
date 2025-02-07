import CreateRoomModal from "@/components/modals/CreateRoomModal"
import JoinRoomByIdModal from "@/components/modals/JoinRoomByIdModal"

function RoomPage() {
    return (
        <div>
            <h1>Here is the game:</h1>
            <p>You can start by</p>
            <div className="flex items-center gap-4">
                <CreateRoomModal />
                <JoinRoomByIdModal />
            </div>
        </div>
    )
}

export default RoomPage
