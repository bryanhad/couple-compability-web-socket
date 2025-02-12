"use client"

import { useClientContext } from "@/context/pusher-client-context"

export default function WaitingPartnerToSubmitView() {
    const { partnerInfo } = useClientContext()

    return (
        <div className="flex flex-col items-center px-6 py-12 text-center rounded-md w-full max-w-[500px]">
            <h1 className="mb-6 text-2xl font-bold text-primary md:text-3xl">
                Love Answers Submitted,
                <br />
                Anticipation Begins!
            </h1>
            <div id="pulsingheart" className="mb-6" style={{ animation: "pulsingheart 1s infinite" }} />
            <p className="mb-2 text-gray-600/70">
                Waiting for <span className="font-semibold text-primary">{partnerInfo ? partnerInfo.displayName : "your partner"}</span> to finish...
            </p>
            <p className="text-sm text-muted-foreground">No peeking at their answers!</p>
        </div>
    )
}
