"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellActions from "./CellActions"
import { ScrapeResult } from "@prisma/client"

export interface ProfileColumn {
  id: string
  name: string
  userId: string
  city: string
  sort: string
  rooms: string
  pages: number
  minPrice: number
  maxPrice: number
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<ProfileColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "city",
    header: "Město",
    cell: ({ row }) => {
      const formatedCell =
        row.original.city.charAt(0).toUpperCase() + row.original.city.slice(1)
      return <>{formatedCell}</>
    },
  },
  {
    accessorKey: "sort",
    header: "Řzení",
  },
  {
    accessorKey: "rooms",
    header: "Dipozice",
    cell: ({ row }) => {
      const formatedCell = row.original.rooms.replace(/[%B]/g, (match) =>
        match === "%" ? "+" : ""
      )

      return <>{formatedCell}</>
    },
  },
  {
    accessorKey: "minPrice",
    header: "Min. cena",
  },
  {
    accessorKey: "maxPrice",
    header: "Max.cena",
  },
  {
    accessorKey: "pages",
    header: "Počet scrapovaných stran",
  },

  {
    id: "action",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
