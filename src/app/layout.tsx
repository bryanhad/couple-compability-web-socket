import ContextProviders from "@/context/ContextProviders"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import GoBackToHomeButton from "@/components/buttons/GoBackToHomeButton"
import FloatingIcons from "@/components/view/FloatingIcons"
import { Heart, MousePointerClick } from "lucide-react"
import BlobBackgroundWrapper from "@/components/client-side-component/BlobBackgroundWrapper"

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Compatibility Test | Find Your Match",
    description:
        "Put your bond to the test with this fun compatibility quiz! Answer questions, compare results, and see if you and your partner are truly in sync. Are you ready to play?",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.className} relative flex min-h-screen bg-[#ffe1f2] antialiased`}>
                <div className="relative z-30 flex flex-[1] flex-col items-center">
                    <header className="flex h-[60px] w-full max-w-[1200px] items-center justify-between p-4">
                        <div>
                            <p className="text-xs italic text-muted-foreground/50">in collaboration with</p>
                            <a
                                href="https://www.instagram.com/mamasays.resto"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative"
                            >
                                <Image alt="mamasays-logo" src="/mamasays-logo.png" width={130} height={20} />
                                <MousePointerClick className="absolute bottom-0 right-0 translate-x-[85%] translate-y-[65%] text-muted-foreground" />
                            </a>
                        </div>
                        <GoBackToHomeButton />
                    </header>
                    <main className="flex w-full max-w-[1200px] flex-[1] flex-col items-center justify-center px-4">
                        <ContextProviders>{children}</ContextProviders>
                    </main>
                    <footer className="flex w-full max-w-[1200px] justify-center pb-3 pt-6 text-center text-xs text-muted-foreground">
                        <div className="mb-2 w-[70%] max-w-[500px] space-y-1">
                            <p>
                                Made with love by <span className="text-nowrap text-primary">Bryan Hadinata</span>
                                <br />
                            </p>
                            <p>Enjoy the game, and may your love be as strong as a well-played strategy!</p>
                        </div>
                    </footer>
                </div>
                <BlobBackgroundWrapper />
                <FloatingIcons icon={<Heart className="shrink-0 text-primary/30" size={40} />} count={10} />
                <Toaster />
            </body>
        </html>
    )
}
