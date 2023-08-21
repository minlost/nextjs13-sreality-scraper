import { cn } from "@/utils/utils"
import { forwardRef } from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, type = "button", ...props }, ref) => {
    return (
      <button
        className={cn(
          `
    w-auto
    rounded-full
    bg-black
    px-5
    py-3
    disabled:opacity-50
    font-semibold
    hover:opacity-75
    transition
    `,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
