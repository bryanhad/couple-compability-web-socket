import ContextProviders from "@/context/ContextProviders"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import GoBackToHomeButton from "@/components/buttons/GoBackToHomeButton"
import FloatingIcons from "@/components/view/FloatingIcons"
import { Heart } from "lucide-react"
import dynamic from "next/dynamic"

const BlobBackground = dynamic(() => import("@/components/client-side-component/BlobBackground"))

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
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
            <body
                className={`${geistSans.variable} ${geistMono.variable} relative flex min-h-screen bg-[#ffe1f2] antialiased`}
            >
                <div className="relative z-30 flex flex-[1] flex-col">
                    <header className="flex h-[60px] w-auto items-center justify-between p-4">
                        <div>
                            <p className="text-muted-foreground/50 text-xs italic">in collaboration with</p>
                            <Image alt="mamasays-logo" src="/mamasays-logo.png" width={135} height={20} />
                        </div>
                        <GoBackToHomeButton />
                    </header>
                    <main className="flex flex-[1] flex-col items-center justify-center px-4">
                        <ContextProviders>{children}</ContextProviders>
                    </main>
                    <Toaster />
                    <footer className="flex justify-center pb-3 pt-6 text-center text-xs text-muted-foreground">
                        <div className="mb-2 w-[70%] max-w-[500px] space-y-1">
                            <p>
                                Made with love by <span className="text-nowrap text-primary">Bryan Hadinata</span>
                                <br />
                            </p>
                            <p>Enjoy the game, and may your love be as strong as a well-played strategy!</p>
                        </div>
                    </footer>
                </div>
                <BlobBackground />
                <FloatingIcons icon={<Heart className="shrink-0 text-primary/30" size={40} />} count={10} />
            </body>
        </html>
    )
}
