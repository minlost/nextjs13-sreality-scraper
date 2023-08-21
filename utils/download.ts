import { v4 as uuidv4 } from "uuid"

interface ScrapedData {
  title: string
  price: string
  address: string
  url: string
}

export function downloadCSV(data: ScrapedData[]) {
  const id = uuidv4()
  const header = ["title", "address", "price", "url"]
  const csvContent = [
    header.join(","),
    ...data.map((row) => `${row.title},${row.address},${row.price},${row.url}`),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `data_${id}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
