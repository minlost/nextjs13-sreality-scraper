"use client"
import { useEffect, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface GraphProps {
  data: {
    id: string
    scrapeResultValueWatchedId: string | null
    price: number | null
    createdAt: string
    updatedAt: string
  }[]
}

const Graph = ({ data }: GraphProps) => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (data.length === 0) {
    return <h2 className="text-xl mt-5 text-red-500">Žádná data</h2>
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  //handle rechart bug
  const error = console.error
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return
    error(...args)
  }

  const renderChart = () => (
    <LineChart width={isMobile ? undefined : 800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis className="text-[12px]" dataKey="createdAt" />
      <YAxis className="text-[12px]" />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#8884d8" />
    </LineChart>
  )

  return (
    <div>
      {isMobile ? (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        </div>
      ) : (
        renderChart()
      )}
    </div>
  )
}

export default Graph
