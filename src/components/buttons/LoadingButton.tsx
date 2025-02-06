import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"

type Props = {
    loading: boolean
    loadingMessage?: string
    noLoadingMessage?: boolean
} & ButtonProps

function LoadingButton({
    loading,
    children,
    type = "submit",
    loadingMessage,
    noLoadingMessage = false,
    ...props
}: Props) {
    return (
        <Button {...props} type={type} disabled={props.disabled || loading}>
            <span className="flex items-center justify-center gap-1">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading
                    ? !noLoadingMessage
                        ? loadingMessage || "Loading..."
                        : null
                    : children}
            </span>
        </Button>
    )
}

export default LoadingButton
