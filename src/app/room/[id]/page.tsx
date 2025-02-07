import WaitingPartnerFallback from "@/components/fallbacks/WaitingPartnerFallback"
import CompabilityForm from "@/components/forms/CompabilityForm"

type Props = {
    params: Promise<{ id: string }>
}

async function RoomIdPage({ params }: Props) {
    const id = (await params).id

    return (
        <WaitingPartnerFallback currentRoomId={id}>
            <div className="w-full max-w-[90%]">
                <CompabilityForm currentRoomId={id} />
            </div>
        </WaitingPartnerFallback>
    )
}

export default RoomIdPage
