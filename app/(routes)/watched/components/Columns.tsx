"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ScrapedPrice } from "@prisma/client"
import CellActions from "./CellActions"
import dateFormat from "dateformat"

import {
  Equal,
  MoveDown,
  MoveDownRight,
  MoveUp,
  MoveUpRight,
} from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WatchetResultColumn = {
  title: string
  price: number
  id: string
  address: string
  url: string
  isPriceChanged: Boolean
  priceList: ScrapedPrice[]
  text?: string | null
  propertyWatcherId: string
}

export const columns: ColumnDef<WatchetResultColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "address",
    header: "Adresa",
  },

  {
    accessorKey: "price",
    header: "Původní cena",
  },
  {
    header: "Poslední cena",
    cell: ({ row }) => {
      const price = row.getValue("priceList") as ScrapedPrice[]
      if (!price.length) return null
      const lastPrice = (price[price.length - 1]?.price || 0) as number

      return <>{lastPrice}</>
    },
  },
  {
    accessorKey: "priceList",
    header: "Vývoj ceny",

    cell: ({ row }) => {
      const price = row.getValue("priceList") as ScrapedPrice[]
      if (!price.length) return null

      const lastPrice = (price[price.length - 1]?.price || 0) as number
      const rowPrice = (row.getValue("price") as number) || 0

      return (
        <div className="flex gap-2">
          {lastPrice === rowPrice && <Equal />}
          {lastPrice > rowPrice && <MoveUpRight />}
          {lastPrice < rowPrice && <MoveDownRight />}
        </div>
      )
    },
  },

  {
    header: "Předposlení scrape",

    cell: ({ row }) => {
      const price = row.getValue("priceList") as ScrapedPrice[]

      if (!price || price.length === 0 || price.length === 1)
        return <>Žádná data</>

      const lastDate = dateFormat(
        price[price.length - 2].createdAt,
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      )
      return <>{lastDate}</>
    },
  },
  {
    header: "Poslední scrape",

    cell: ({ row }) => {
      const price = row.getValue("priceList") as ScrapedPrice[]

      if (!price || price.length < 1) return <>Žádná data</>

      const lastDate = dateFormat(
        price[price.length - 1].createdAt,
        "dddd, mmmm dS, yyyy, h:MM:ss TT"
      )
      return <>{lastDate}</>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
