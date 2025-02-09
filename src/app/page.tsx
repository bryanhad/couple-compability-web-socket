import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
    return (
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
            <h1 className="mb-4 flex max-w-min flex-col text-4xl font-bold leading-none text-primary md:mb-6 md:text-6xl">
                <span className="text-start text-xl">Are You a</span>
                <span className="text-nowrap">Perfect Match</span>
                <div
                    className="pulse-title relative self-center"
                    style={{ animation: "pulsingheart 1s infinite" }}
                >
                    <div id="pulsingheart" />
                    <span className="absolute right-1/2 top-[47%] -translate-y-1/2 translate-x-1/2 pb-1 text-xl leading-none text-white">
                        or
                    </span>
                </div>
                <span className="text-end">Just Rolling the Dice?</span>
            </h1>
            <p className="mb-8 w-[70%] max-w-[400px] text-lg md:mb-10 md:text-xl">
                Find out if you and your partner are truly in sync!
            </p>
            <Button
                asChild
                className="bg-primary px-8 py-6 text-xl text-white hover:bg-red-600"
            >
                <Link href="/room">Ready to Play?</Link>
            </Button>
        </div>
    )
}
