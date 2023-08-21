import { Loader, MoreHorizontal } from "lucide-react"
import { FC } from "react"
import { Button } from "./Button"

interface ActionButtonProps {
  isLoading: boolean
  children?: React.ReactNode
}

const ActionButton: FC<ActionButtonProps> = ({ isLoading }) => {
  return (
    <>
      <span className="sr-only">Open menu</span>
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <MoreHorizontal className="h-4 w-4" />
      )}
    </>
  )
}

export default ActionButton
