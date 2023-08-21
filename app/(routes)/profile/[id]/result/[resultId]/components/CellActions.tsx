"use client"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import axios, { AxiosError } from "axios"
import { Loader, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { ResultColumn } from "./Columns"
import AlertModal from "@/components/modals/AlertModal"
import ActionButton from "@/components/ui/ActionButton"

interface CellActionsProps {
  data: ResultColumn
}

const CellActions = ({ data }: CellActionsProps) => {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const respose = await axios.delete(
        `http://localhost:3000/api/profile/${params.id}/${params.resultId}/${data.id}`
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

  const handleAddProperty = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `http://localhost:3000/api/watcher/${data.id}`
      )
      toast.success("Přidáno")
    } catch (error) {
      let axiosError = error as AxiosError<{ error: string }>
      if (
        axiosError.response &&
        axiosError.response?.data.error === "Property already being watched"
      ) {
        toast.error("Nemovitost už je sledována")
      } else {
        toast.error("Něco se pokazilo")
      }
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
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
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
          <Link
            href={`https://www.sreality.cz${data.url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DropdownMenuItem>Navštívit stránku</DropdownMenuItem>{" "}
          </Link>
          <DropdownMenuItem onClick={handleAddProperty}>
            Přidat do sledovaných
          </DropdownMenuItem>

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
