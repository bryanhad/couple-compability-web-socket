import WaitingPartnerJoinFallback from "@/components/fallbacks/WaitingPartnerToJoinFallback"
import WaitingPartnerToSubmitFallbackAndResultView from "@/components/fallbacks/WaitingPartnerToSubmitFallbackAndResultView"

type Props = {
    params: Promise<{ id: string }>
}

async function RoomIdPage({ params }: Props) {
    const id = (await params).id

    return (
        <WaitingPartnerJoinFallback currentRoomId={id}>
            <WaitingPartnerToSubmitFallbackAndResultView currentRoomId={id} />
        </WaitingPartnerJoinFallback>
    )
}

export default RoomIdPage
