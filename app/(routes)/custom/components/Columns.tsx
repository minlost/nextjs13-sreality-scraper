"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellActions from "./CellActions"

export type CustomColumn = {
  title: string
  price: string
  address: string
  url: string
}

export const columns: ColumnDef<CustomColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "String",
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
