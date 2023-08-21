import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Loader, MoreHorizontal } from "lucide-react"
import React, { use, useState } from "react"
import { ProfileColumn } from "./Columns"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import AlertModal from "@/components/modals/AlertModal"
import ActionButton from "@/components/ui/ActionButton"

interface CellActionsProps {
  data: ProfileColumn
}

const CellActions = ({ data }: CellActionsProps) => {
  const router = useRouter()
  const params = useParams()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const respose = await axios.delete(
        `http://localhost:3000/api/profile/${params.id}/${data.id}`
      )
      toast.success("Smazáno")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Něco se pokazilo")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isLoading}
            className="h-8 w-8 p-0  border flex justify-center items-center  hover:animate-wiggle-side"
          >
            <ActionButton isLoading={isLoading} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Akce</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <Link href={`/profile/${params.id}/result/${data.id}`}>
            <DropdownMenuItem>Otevřit výsledek</DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="focus:bg-red-500 cursor-pointer"
          >
            Vymazat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellActions
