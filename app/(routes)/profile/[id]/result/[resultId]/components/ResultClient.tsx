"use client"

import { DataTable } from "@/components/ui/DataTable"
import { columns } from "./Columns"

interface ResultPageProps {
  result: any
}

const ResultClient = ({ result }: ResultPageProps) => {
  return (
    <div>
      <DataTable columns={columns} data={result.scrapeResultValue} />
    </div>
  )
}

export default ResultClient
