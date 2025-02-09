import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/utils/shadcn"

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
    className,
    ...props
}: Props) {
    return (
        <Button className={cn('rounded-full', className)} {...props} type={type} disabled={props.disabled || loading}>
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
