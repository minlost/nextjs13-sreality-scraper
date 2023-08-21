"use client"

import { ColumnDef } from "@tanstack/react-table"
import dateFormat from "dateformat"
import CellActions from "./CellActions"

export interface ProfileColumn {
  id: string

  createdAt: Date
}

export const columns: ColumnDef<ProfileColumn>[] = [
  {
    accessorKey: "createdAt",
    header: "Vyvořeno",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT")
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
]
