"use client"

import Button from "@/data/b"
import axios from "axios"
import { RefreshCwIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC, useState } from "react"
import toast from "react-hot-toast"

interface RefreshButtonProps {
  propertyWatcher: {
    watchedProperyWatched: {
      priceList: {
        id: string
        scrapeResultValueWatchedId: string | null
        price: number | null
        createdAt: Date
        updatedAt: Date
      }[]
      id: string
      title: string
      price: number
      address: string
      url: string
      isPriceChanged: Boolean
      text?: string | null
    }[]
  } | null
}

const RefreshButton: FC<RefreshButtonProps> = ({ propertyWatcher }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleScrapeAll = async () => {
    setIsLoading(true)
    toast.success("Scrapuji data")
    try {
      const response = await axios.post(`/api/watcher/scrapeall`, {
        data: propertyWatcher?.watchedProperyWatched,
      })
      toast.success("Data byla scrapována")
      router.refresh()
    } catch (e) {
      toast.error("Data nebyla scrapována")
    } finally {
      setIsLoading(false)
    }
  }

  if (!propertyWatcher) return null

  return (
    <Button onClick={handleScrapeAll} disabled={isLoading}>
      {propertyWatcher.watchedProperyWatched.length > 0 && (
        <RefreshCwIcon className="w-7 h-7 text-neutral-500 hover:text-neutral-600 cursor-pointer" />
      )}
    </Button>
  )
}
export default RefreshButton
