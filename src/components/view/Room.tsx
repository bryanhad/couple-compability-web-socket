"use client"

import { useClientContext } from "@/context/pusher-client-context"
import { useChannelSubscription } from "@/hooks/use-channel-subscription"
import { useGetFormQuestions } from "@/hooks/use-get-form-questions"
import { useNoPusherClientGuard } from "@/hooks/use-no-pusher-client-guard"
import CompabilityForm from "../forms/compability-form"
import CompabilityResult from "../view/CompabilityResult"
import WaitingPartnerToJoinView from "../view/WaitingPartnerToJoinView"
import WaitingPartnerToSubmitView from "../view/WaitingPartnerToSubmitView"
import LoadingView from "./LoadingView"

type Props = {
    currentRoomId: string
}

function Room({ currentRoomId }: Props) {
    const { pusherClient } = useNoPusherClientGuard()
    const { userInfo, partnerInfo } = useClientContext()
    const { isWaitingPartner } = useChannelSubscription(currentRoomId)
    const { formQuestions, selectedLanguage } = useGetFormQuestions()

    if (!pusherClient || (userInfo?.role === "joiner" && !userInfo.isValid)) {
        return <LoadingView />
    }

    if (userInfo?.role === "creator" && isWaitingPartner) {
        return <WaitingPartnerToJoinView currentRoomId={currentRoomId} />
    }

    if (!partnerInfo || formQuestions.length < 1) {
        return <LoadingView />
    }

    if (!!userInfo?.formValues === false) {
        return <CompabilityForm currentRoomId={currentRoomId} formQuestions={formQuestions} />
    }

    if (!!partnerInfo?.formValues === false) {
        return <WaitingPartnerToSubmitView />
    }

    return <CompabilityResult formLanguage={selectedLanguage} />
}

export default Room
