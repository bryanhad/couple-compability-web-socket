import CreateRoomModal from "@/components/modals/CreateRoomModal"
import JoinRoomByIdModal from "@/components/modals/JoinRoomByIdModal"

function RoomPage() {
    return (
        <div className="flex flex-col items-center gap-4 text-center md:gap-6">
            <h1 className="text-4xl font-bold leading-none text-primary md:text-6xl">
                Time to Choose Your Path!
            </h1>
            {/* <ul className="w-[80%] text-center">
                <li className="bg-primary/60 text-white rounded-md py-2 px-3">
                    You can either be the game master and create a new room,
                </li>
                <li>or join your partner's existing love quest!</li>
            </ul> */}
            <p className="w-[70%] max-w-[400px] text-sm text-muted-foreground md:text-lg">
                No pressure, but choosing wrong might cost you dessert! 😉
            </p>
            <div className="flex items-center gap-4 w-full">
                <CreateRoomModal />
                <JoinRoomByIdModal />
            </div>
        </div>
    )
}

export default RoomPage
