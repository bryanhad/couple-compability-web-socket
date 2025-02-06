import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function Home() {
    return (
        <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold text-red-600 md:text-6xl">
                Love Match at Mamasays
            </h1>
            <p className="mb-8 text-xl text-gray-700 md:text-2xl">
                Is your love as perfect as a full house in Monopoly? Find out if
                you and your partner are on the same game board!
            </p>
            <Button
                asChild
                className="bg-red-500 px-8 py-6 text-xl text-white hover:bg-red-600"
            >
                <Link href="/room/create">
                    <Heart className="mr-2 h-6 w-6" />
                    Start Your Love Game
                </Link>
            </Button>
        </div>
    )
}
