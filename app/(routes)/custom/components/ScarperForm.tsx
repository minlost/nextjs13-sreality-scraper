"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { downloadCSV } from "@/utils/download"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { citiOptions } from "@/utils/formOptions/cityOptions"
import { saveOptions } from "@/utils/formOptions/saveOptions"
import { sortOptions } from "@/utils/formOptions/sorOptions"
import { roomOptions } from "@/utils/formOptions/roomOptions"
import { DataTable } from "../../../../components/ui/DataTable"
import { columns } from "./Columns"
import { Button } from "@/components/ui/Button"
import ResizeButton from "@/components/ui/ResizeButton"
import { ArrowBigDown } from "lucide-react"

const formSchema = z
  .object({
    city: z.string().nonempty({ message: "Vyberte město" }),
    sort: z.string().nonempty({ message: "Vyberte řazení" }),
    pages: z.number().min(0, { message: "Počet stran musí být kladné číslo" }),
    rooms: z.string().nonempty({ message: "Vyberte dispozici" }),
    minPrice: z
      .number()
      .min(0, { message: "Minimální cena musí být kladné číslo" }),
    maxPrice: z
      .number()
      .min(0, { message: "Maximální cena musí být kladné číslo" }),
    option: z.string().nonempty({ message: "Vyberte způsob uložení" }),
    fileName: z.string(),
  })
  .refine(
    (data) => {
      if (data.option === "0" && !data.fileName) {
        return false
      }
      return true
    },
    { path: ["fileName"], message: "Vyplňte název souboru" }
  )

type FormValues = z.infer<typeof formSchema>

export interface ScrapedData {
  title: string
  price: string
  address: string
  url: string
}

const ScraperForm = () => {
  //prevent hydration error
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  //states
  const [isLoading, setIsLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(true)
  const [scrapedData, setScrapedData] = useState<ScrapedData[] | []>([])
  const [currentOption, setCurrentOption] = useState("0")

  //form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "praha",
      sort: "nejlevnejsi",
      pages: 1,
      rooms: "1%2Bkk",
      minPrice: 1,
      maxPrice: 5000000,
      option: "0",
      fileName: `data`,
    },
  })

  const onSubmit = async (inputData: FormValues) => {
    setIsLoading(true)
    toast.success("Scraping běží")
    try {
      if (form.getValues("option") === "0") {
        const response = await axios.post("/api/scrape/op0", inputData)
      }
      if (form.getValues("option") === "1" || "2") {
        const response = await axios.post("/api/scrape/op1", inputData)
      }
      const response = await axios.post("/api/scrape/op0", inputData)

      setScrapedData(await response.data)

      if (form.getValues("option") === "2") {
        downloadCSV(await response.data)
      }

      toast.success("Scraping dokončeno")
    } catch (error) {
      console.log(error)

      toast.error("Scraping selhal")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-6 p-8 border-2 rounded-xl shadow-lg bg-slate-200 max-w-xl w-full mb-4 relative">
        <ResizeButton onClick={() => setFormOpen((prev) => !prev)} />
        {!formOpen && (
          <ArrowBigDown className="self-center w-8 h-8 text-slate-500" />
        )}
        {formOpen && (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="option"
                >
                  Způsob uložení
                </label>
                <select
                  className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                  {...form.register("option")}
                  onChange={(e) => {
                    form.setValue("option", e.target.value)
                    setCurrentOption(e.target.value)
                  }}
                >
                  {saveOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {currentOption === "0" && (
                <>
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="fileName"
                    >
                      Název souboru
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                      {...form.register("fileName")}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="city"
                >
                  Město
                </label>
                <select
                  className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                  {...form.register("city")}
                >
                  {citiOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/2 px-2 mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="sort"
                >
                  Řazení
                </label>
                <select
                  className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                  {...form.register("sort")}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label
                  className="block h-10 mb-2 text-sm font-bold text-gray-700 my-auto"
                  htmlFor="pages"
                >
                  Počet stran (0 = všechny)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                  {...form.register("pages", { valueAsNumber: true })}
                />
              </div>

              <div className="w-full md:w-2/3 px-2 mb-4">
                <label
                  className="block h-10 mb-2 text-sm font-bold text-gray-700 my-auto"
                  htmlFor="rooms"
                >
                  Dispozice
                </label>
                <select
                  className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                  {...form.register("rooms")}
                >
                  {roomOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="minPrice"
                >
                  Minimální cena
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                  {...form.register("minPrice", { valueAsNumber: true })}
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="maxPrice"
                >
                  Maximální cena
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
                  {...form.register("maxPrice", { valueAsNumber: true })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Načítání" : "Spustit"}
              {isLoading && <div className="animate-spin ">🌀</div>}
            </Button>
          </form>
        )}
      </div>
      <div>
        {scrapedData && scrapedData.length > 0 && (
          <DataTable columns={columns} data={scrapedData} />
        )}
      </div>
    </div>
  )
}
export default ScraperForm
