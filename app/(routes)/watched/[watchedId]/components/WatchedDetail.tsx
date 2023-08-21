"use client"

import { ScrapeResultValueWatched } from "@prisma/client"
import { formatDate } from "@/lib/formateDate"
import dynamic from "next/dynamic"

const Graph = dynamic(() => import("./Graph"), { ssr: false })

interface WatchedDetailProps {
  data:
    | (ScrapeResultValueWatched & {
        priceList: {
          id: string
          scrapeResultValueWatchedId: string | null
          price: number | null
          createdAt: Date
          updatedAt: Date
        }[]
      })
    | null
}

const WatchedDetail = ({ data }: WatchedDetailProps) => {
  const formattedPriceList =
    data?.priceList?.map((item) => ({
      ...item,
      createdAt: formatDate(new Date(item.createdAt)),
      updatedAt: formatDate(new Date(item.updatedAt)),
    })) || []

  return (
    <>
      <h2 className="text-center mb-5 text-4xl font-semibold text-neutral-500">
        Vývoj ceny
      </h2>
      <p className="text-neutral-500">{data?.address}</p>
      <p className="text-neutral-500">{data?.title}</p>
      <Graph data={formattedPriceList} />
    </>
  )
}

export default WatchedDetail
