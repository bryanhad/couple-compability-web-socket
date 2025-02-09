interface Props {
    text: string
    className?: string
}

function RippleText({ text, className = "" }: Props) {
    return (
        <h1 className={className}>
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    className="inline-block bounce"
                    style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "1s",
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </h1>
    )
}

export default RippleText