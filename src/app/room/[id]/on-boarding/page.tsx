import OnBoardingForm from "@/components/forms/OnBoardingForm"

type Props = {
    params: Promise<{ id: string }>
}

async function RoomOnBoardingPage({ params }: Props) {
    const id = (await params).id

    return (
        <div>
            <OnBoardingForm roomId={id} />
        </div>
    )
}

export default RoomOnBoardingPage
