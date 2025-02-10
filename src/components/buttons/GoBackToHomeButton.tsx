"use client"

import { Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

function GoBackToHomeButton() {
    const pathname = usePathname()

    if (pathname === "/") return null

    return (
        <>
                <Link href={"/"} className="p-2">
                    <Home
                        className="shrink-0 text-muted-foreground"
                        size={30}
                    />
                </Link>
        </>
    )
}

export default GoBackToHomeButton
