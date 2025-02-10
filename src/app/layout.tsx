import ContextProviders from "@/context/ContextProviders"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import GoBackToHomeButton from "@/components/buttons/GoBackToHomeButton"
import FloatingIcons from "@/components/view/FloatingIcons"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Compability Test | mamasays",
    description: "A simple app for mamasays's valentine's day event",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} relative flex min-h-screen bg-gradient-to-b from-pink-100 to-red-200/70 antialiased`}
            >
                <div className="relative z-20 flex flex-[1] flex-col">
                    <header className="flex h-[60px] w-auto items-center justify-between p-4">
                        <Image
                            alt="mamasays-logo"
                            src="/mamasays-logo.png"
                            width={150}
                            height={25}
                        />
                        <GoBackToHomeButton />
                    </header>
                    <main className="flex flex-[1] flex-col items-center justify-center px-4">
                        <ContextProviders>{children}</ContextProviders>
                    </main>
                    <Toaster />
                    <footer className="flex justify-center pb-3 pt-6 text-center text-xs text-muted-foreground">
                        <div className="mb-2 w-[70%] max-w-[500px] space-y-1">
                            <p>
                                Made with love by{" "}
                                <span className="text-nowrap text-primary">
                                    Bryan Hadinata
                                </span>
                                <br />
                            </p>
                            <p>
                                Enjoy the game, and may your love be as strong
                                as a well-played strategy!
                            </p>
                        </div>
                    </footer>
                </div>
                <FloatingIcons icon={<div id="heart" />} count={10} />
            </body>
        </html>
    )
}
