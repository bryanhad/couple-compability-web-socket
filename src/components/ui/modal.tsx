import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/utils/shadcn"
import React from "react"

type ModalProps = {
    centerText?: boolean
    children: React.ReactNode
    title?: string
    desc?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
    disableDefaultCloseButton?: boolean
} & (
    | { buttonText: string; buttonCustom?: never }
    | {
          buttonCustom: React.ReactNode
          buttonText?: never
      }
    | {
          buttonText?: never
          buttonCustom?: never
          noButtonTrigger: boolean
      }
)

function Modal({
    centerText = false,
    open,
    onOpenChange,
    children,
    buttonCustom,
    buttonText,
    title,
    desc,
    className,
    disableDefaultCloseButton,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {buttonCustom && (
                <DialogTrigger asChild>{buttonCustom}</DialogTrigger>
            )}
            {buttonText && (
                <DialogTrigger asChild>
                    <Button variant={"outline"}>{buttonText}</Button>
                </DialogTrigger>
            )}
            <DialogContent
                disableDefaultCloseButton={disableDefaultCloseButton}
                className={cn("w-full max-w-[95%] sm:max-w-md rounded-md", className)}
            >
                {(title || desc) && (
                    <DialogHeader className="flex flex-col gap-1 items-center">
                        <DialogTitle
                            className={cn({
                                "text-center leading-snug text-primary": centerText,
                            })}
                        >
                            {title}
                        </DialogTitle>
                        {desc && (
                            <DialogDescription
                                asChild={(typeof desc === 'string') === false}
                                className={cn({ "text-center max-w-[340px] text-foreground/60": centerText })}
                            >
                                {desc}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                )}
                <div className="flex items-center space-x-2">{children}</div>
            </DialogContent>
        </Dialog>
    )
}

export default Modal
