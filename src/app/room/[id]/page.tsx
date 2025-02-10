import Room from "@/components/view/Room"

type Props = {
    params: Promise<{ id: string }>
}

async function RoomIdPage({ params }: Props) {
    const id = (await params).id

    return <Room currentRoomId={id} />
}

export default RoomIdPage
