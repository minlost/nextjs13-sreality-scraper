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
import { Loader, MoreHorizontal } from "lucide-react"
import React, { useState } from "react"
import { WatchetResultColumn } from "./Columns"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { set } from "zod"
import Link from "next/link"
import ActionButton from "@/components/ui/ActionButton"

interface CellActionsProps {
  data: WatchetResultColumn
}

const CellActions = ({ data }: CellActionsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleScrape = async () => {
    toast.success("Scrapuji data")
    setIsLoading(true)
    try {
      const response = await axios.post(`/api/watcher/scrape/${data.id}`, {
        propertyWatcherId: data.propertyWatcherId,
        url: `https://www.sreality.cz${data.url}`,
      })
      toast.success("Data byla scrapována")
      router.refresh()
    } catch (e) {
      toast.error("Data nebyla scrapována")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    toast.success("Mažu data")
    setIsLoading(true)
    try {
      const response = await axios.delete(`/api/watcher/${data.id}`, {
        data: {
          propertyWatcherId: data.propertyWatcherId,
        },
      })
      toast.success("Smazáno")
      router.refresh()
    } catch (error) {
      toast.error("Něco se pokazilo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(
              `https://www.sreality.cz/detail${data.url}`
            )
          }
        >
          Zkopírovat URL
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleScrape}>
          Scapovat Data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link
          href={`https://www.sreality.cz${data.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DropdownMenuItem>Navštívit stránku</DropdownMenuItem>
        </Link>
        <Link href={`/watched/${data.id}`}>
          <DropdownMenuItem> Graf vývoje ceny</DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={handleDelete}
          className="focus:bg-red-500 cursor-pointer"
        >
          Odebrat z watchlistu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CellActions
