"use client"

import { usePusherClientContext } from "@/context/pusher-client-context"

// Helper function to calculate match percentage
function calculateMatchPercentage(
    user1: Record<string, string>,
    user2: Record<string, string>,
): number {
    const keys = Object.keys(user1)
    const totalQuestions = keys.length
    let matches = 0

    keys.forEach((key) => {
        if (user1[key] === user2[key]) {
            matches++
        }
    })

    return (matches / totalQuestions) * 100 // Convert to percentage
}

function CompabilityResult() {
    const { userInfo, partnerInfo } = usePusherClientContext()

    // Ensure both userInfo and partnerInfo are present and have formValues
    if (!userInfo?.formValues || !partnerInfo?.formValues) {
        return <div>Loading compatibility results...</div>
    }

    const matchPercentage = calculateMatchPercentage(
        userInfo.formValues,
        partnerInfo.formValues,
    )

    return (
        <div>
            <h1>This is the result!</h1>
            <div className="mt-2 flex flex-col gap-2 rounded-md border p-4">
                <div>
                    <p className="font-semibold">
                        My ({userInfo?.displayName}) Answer:
                    </p>
                    <p>{JSON.stringify(userInfo?.formValues)}</p>
                </div>
                <div>
                    <p className="font-semibold">
                        Joiner's ({partnerInfo?.displayName}) Answer:
                    </p>
                    <p>{JSON.stringify(partnerInfo?.formValues)}</p>
                </div>
                <div className="mt-4 text-xl font-bold">
                    ✅ Compatibility Match: {matchPercentage.toFixed(2)}%
                </div>
            </div>
        </div>
    )
}

export default CompabilityResult
