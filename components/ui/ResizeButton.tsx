import { cn } from "@/utils/utils"
import { Scaling } from "lucide-react"
import { forwardRef } from "react"

export interface ResizeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ResizeButton = forwardRef<HTMLButtonElement, ResizeButtonProps>(
  ({ children, className, type = "button", ...props }, ref) => {
    return (
      <button
        className={cn(
          `
    w-auto
    rounded-full
    disabled:opacity-50
    font-semibold
    hover:opacity-75
    transition
    absolute
    top-2
    right-5
    `,
          className
        )}
        ref={ref}
        {...props}
      >
        <Scaling />
        {children}
      </button>
    )
  }
)

ResizeButton.displayName = "Button"

export default ResizeButton
