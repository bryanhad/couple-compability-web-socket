"use client"

import { useClientContext } from "@/context/pusher-client-context"
import { useChannelSubscription } from "@/hooks/use-channel-subscription"
import { useGetFormQuestions } from "@/hooks/use-get-form-questions"
import { useJoinRoom } from "@/hooks/use-join-room"
import { useNoPusherClientGuard } from "@/hooks/use-no-pusher-client-guard"
import { LoaderCircle } from "lucide-react"
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
    const { channelMemberCount, userInfo, partnerInfo } = useClientContext()
    const { isWaitingPartner } = useChannelSubscription(currentRoomId)
    const { isJoiningRoom } = useJoinRoom(currentRoomId)
    const { formQuestions, selectedLanguage } = useGetFormQuestions()

    if (!pusherClient || (userInfo?.role === "joiner" && channelMemberCount < 2)) {
        return <LoadingView />
    }

    if (isWaitingPartner) {
        return <WaitingPartnerToJoinView currentRoomId={currentRoomId} />
    }

    if (isJoiningRoom || !partnerInfo || formQuestions.length < 1) {
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
