"use client"

import { Button } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { ScrapeResult, ScraperProfile } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { columns } from "./Columns"
import toast from "react-hot-toast"

interface ScrapeClientProps {
  option: ScraperProfile
  id: string
  scrapeResults: ScrapeResult[]
}

const ScrapeClient = ({ id, option, scrapeResults }: ScrapeClientProps) => {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) {
    return null
  }

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(`/api/profile/scrape/${id}`, {
        storeId: id,
        option: option,
      })
      toast.success("Scrapování dokončeno")
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error("Něco se pokazilo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-center gap-4 mt-5">
        <Button
          onClick={handleClick}
          className="text-white"
          disabled={isLoading}
        >
          {isLoading ? "Načítání" : "Scrape"}
          {isLoading && <div className="animate-spin ">🌀</div>}
        </Button>
      </div>
      <div className="flex flex-col gap-5 my-5 ">
        <DataTable data={scrapeResults} columns={columns} />
      </div>
    </div>
  )
}

export default ScrapeClient
