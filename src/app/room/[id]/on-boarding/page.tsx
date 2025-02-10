import OnBoardingForm from "@/components/forms/OnBoardingForm"

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ cname: string | undefined }>
}

async function RoomOnBoardingPage({ params, searchParams }: Props) {
    const id = (await params).id
    const creatorName = (await searchParams).cname

    return (
        <div className="text-center w-full flex flex-col items-center">
            <h1 className="pulse text-4xl font-bold leading-none text-primary md:text-6xl mb-4">
                Welcome to the<br/>Compability Test
            </h1>
            <p className="mb-6">
                <span className="font-semibold text-primary/80">
                    {creatorName}
                </span>{" "}
                is waiting for you to join their room!
            </p>
            <OnBoardingForm roomId={id} />
        </div>
    )
}

export default RoomOnBoardingPage
