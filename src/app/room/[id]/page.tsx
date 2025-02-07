import WaitingPartnerFallback from "@/components/fallbacks/WaitingPartnerFallback"
import CompabilityForm from "@/components/forms/CompabilityForm"

type Props = {
    params: Promise<{ id: string }>
}

async function RoomIdPage({ params }: Props) {
    const id = (await params).id

    return (
        <WaitingPartnerFallback currentRoomId={id}>
            <CompabilityForm />
        </WaitingPartnerFallback>
    )
}

export default RoomIdPage
