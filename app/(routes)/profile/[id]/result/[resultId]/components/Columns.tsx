"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellActions from "./CellActions"
import { ScrapeResult } from "@prisma/client"

export interface ResultColumn {
  id: string
  scrapeResultId: string
  title: string
  address: string
  price: number
  url: string
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<ResultColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Cena",
  },
  {
    accessorKey: "address",
    header: "Address",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
