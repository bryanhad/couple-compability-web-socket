"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"

export default function WaitingPartnerToSubmitView() {
    const { partnerInfo } = usePusherClientContext()

    return (
        <div className="flex flex-col items-center border bg-white p-6 text-center">
            <h1 className="mb-6 text-2xl font-bold text-primary md:text-3xl">
                Love Answers Submitted,
                <br />
                Anticipation Begins!
            </h1>
            <div
                id="pulsingheart"
                className="mb-6"
                style={{ animation: "pulsingheart 1s infinite" }}
            />
            <p className="mb-2">
                Waiting for{" "}
                <span className="font-semibold text-primary">
                    {partnerInfo ? partnerInfo.displayName : "your partner"}
                </span>{" "}
                to fnish...
            </p>
            <p className="text-sm text-muted-foreground">
                No peeking at their answers!
            </p>
        </div>
    )
}
