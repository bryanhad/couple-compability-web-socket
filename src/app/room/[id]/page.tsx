import WaitingPartnerFallback from "@/components/fallbacks/WaitingPartnerFallback"

type Props = {
    params: Promise<{ id: string }>
}

async function RoomIdPage({ params }: Props) {
    const id = (await params).id

    return (
        <WaitingPartnerFallback currentRoomId={id}>
            <div>
                <h1>This is room {id}</h1>
            </div>
        </WaitingPartnerFallback>
    )
}

export default RoomIdPage
