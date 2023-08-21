import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { CustomColumn } from "./Columns"

interface CellActionsProps {
  data: CustomColumn
}

const CellActions = ({ data }: CellActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="h-8 w-8 p-0  border flex justify-center items-center  hover:animate-wiggle-side">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Akce</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(
              `https://www.sreality.cz/detail${data.url}`
            )
          }
        >
          Zkopírovat URL
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={`https://www.sreality.cz${data.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Navštívit stránku
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CellActions
