'use client'

import { useEffect, useRef, useState } from 'react'

export type CountUpProps = {
    to: number
    from?: number
}

// DONT ASK ME ABOUT THIS COMPONENT. I MADE IT FULLY WITH CHAT GPT HAHA

export default function CountUp({ to, from = 0 }: CountUpProps) {
    const [count, setCount] = useState(from)
    const ref = useRef<HTMLDivElement | null>(null)
    const hasIntersected = useRef(false)

    useEffect(() => {
        const element = ref.current

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const entry = entries[0]

            if (entry.isIntersecting && !hasIntersected.current) {
                hasIntersected.current = true

                // Start counting with dynamic increments for ease-out effect
                let currentCount = from

                const interval = setInterval(() => {
                    const remaining = to - currentCount
                    const increment = Math.max(remaining / 10, 1) // Dynamic increment, with minimum step of 1

                    currentCount += increment
                    if (currentCount >= to) {
                        setCount(to)
                        clearInterval(interval)
                    } else {
                        setCount(Math.floor(currentCount))
                    }
                }, 55) // Approximately 60 frames per second
            }
        }

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5, // Trigger when 50% of the component is visible
        })

        if (element) {
            observer.observe(element)
        }

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [from, to])

    return <span ref={ref}>{count}</span>
}
