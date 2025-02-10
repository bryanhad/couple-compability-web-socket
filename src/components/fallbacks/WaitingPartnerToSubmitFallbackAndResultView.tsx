"use client"

import CompabilityResult from "../view/CompabilityResult"
import CompabilityForm from "../forms/compability-form"
import { usePusherClientContext } from "@/context/pusher-client-context"
import WaitingPartnerToSubmitView from "../view/WaitingPartnerToSubmitView"

type Props = {
    currentRoomId: string
}

function WaitingPartnerToSubmitFallbackAndResultView({ currentRoomId }: Props) {
    const { userInfo, partnerInfo } = usePusherClientContext()

    if (!!userInfo?.formValues === false) {
        return (
            <div className="w-full max-w-[90%]">
                <CompabilityForm currentRoomId={currentRoomId} />
            </div>
        )
    } else if (!!partnerInfo?.formValues === false) {
        return (
            <WaitingPartnerToSubmitView/>
        )
    }
    return <CompabilityResult />
}

export default WaitingPartnerToSubmitFallbackAndResultView
