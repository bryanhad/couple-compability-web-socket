import RefreshPusherClient from "@/components/client-side-component/RefreshPusherClient"
import CreateRoomModal from "@/components/modals/CreateRoomModal"
import JoinRoomByIdModal from "@/components/modals/JoinRoomByIdModal"

function RoomPage() {
    return (
        <>
            <div className="flex flex-col items-center gap-4 text-center md:gap-6">
                <h1 className="pulse text-4xl font-bold leading-tight tracking-wide text-primary md:text-6xl">
                    Time to Choose
                    <br />
                    Your Path!
                </h1>
                <p className="w-[70%] max-w-[400px] text-sm text-muted-foreground md:text-lg">
                    No pressure, but choosing wrong might cost you dessert! 😉
                </p>
                <div className="flex w-full items-center gap-4">
                    <CreateRoomModal />
                    <JoinRoomByIdModal />
                </div>
            </div>
            <RefreshPusherClient />
        </>
    )
}

export default RoomPage
