"use client"

import React, { useEffect, useState } from "react"

type FloatingIconsProps = {
    icon: React.ReactNode
    count?: number // Number of floating icons
}

type FloatingIcon = {
    id: number
    left: string
    duration: number
    delay: number
}

export default function FloatingIcons({ icon, count = 5 }: FloatingIconsProps) {
    const [icons, setIcons] = useState<FloatingIcon[]>([])

    useEffect(() => {
        const generateIcons = () => {
            return Array.from({ length: count }).map((_, index) => ({
                id: index,
                left: `${Math.random() * 100}%`, // Random horizontal position
                duration: Math.random() * 8 + 5, // Random duration between 3s - 8s
                delay: Math.random() * 2, // Random delay
            }))
        }

        setIcons(generateIcons())
    }, [count])

    return (
        <div
            className="pointer-events-none fixed inset-0 overflow-hidden z-10"
            style={{ width: "112%", left: "-12%" }}
        >
            {icons.map(({ id, left, duration, delay }) => (
                <div
                    key={id}
                    className="floating-icon absolute bottom-0"
                    style={{
                        bottom: -60,
                        left,
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`,
                    }}
                >
                {icon}
                </div>
            ))}
        </div>
    )
}
