import CreateRoomButton from "@/components/buttons/CreateRoomButton"
import JoinRoomByIdModal from "@/components/modals/JoinRoomByIdModal"

function RoomPage() {
    return (
        <div>
            <h1>Here is the game:</h1>
            <p>You can start by</p>
            <div className="flex items-center gap-4">
                <CreateRoomButton />
                <JoinRoomByIdModal />
            </div>
        </div>
    )
}

export default RoomPage
