type Props = {
    params: Promise<{ id: string }>
}

async function RoomIdPage({ params }: Props) {
    const id = (await params).id

    return (
        <div>
            <h1>This is room {id}</h1>
        </div>
    )
}

export default RoomIdPage
