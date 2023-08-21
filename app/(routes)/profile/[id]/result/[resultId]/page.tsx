import { DataTable } from "@/components/ui/DataTable"
import { db } from "@/utils/client/prismaDb"
import React from "react"
import { columns } from "./components/Columns"
import ResultClient from "./components/ResultClient"

interface ResultPageProps {
  params: {
    resultId: string
  }
}

const ResultPage = async ({ params }: ResultPageProps) => {
  const result = await db.scrapeResult.findFirst({
    where: {
      id: params.resultId,
    },
    include: {
      scrapeResultValue: {
        orderBy: {
          price: "asc",
        },
      },
    },
  })

  return (
    <div className="flex justify-center">
      {result && (
        // <DataTable columns={columns} data={result.scrapeResultValue} />
        <ResultClient result={result} />
      )}
    </div>
  )
}

export default ResultPage
