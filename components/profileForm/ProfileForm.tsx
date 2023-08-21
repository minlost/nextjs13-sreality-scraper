"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/Button"
import { citiOptions } from "@/utils/formOptions/cityOptions"
import { roomOptions } from "@/utils/formOptions/roomOptions"
import { sortOptions } from "@/utils/formOptions/sorOptions"
import axios from "axios"
import { useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import toast from "react-hot-toast"

const formSchema = z.object({
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
  name: z.string().nonempty({ message: "Vyplňte název profilu" }),
})

type FormValues = z.infer<typeof formSchema>

interface ScrapedData {
  title: string
  price: string
  address: string
  url: string
}

interface ProfileFromProps {
  userId: string
  isLoading: boolean
  setIsLoading: React.Dispatch<SetStateAction<boolean>>
  setIsOpened: React.Dispatch<SetStateAction<boolean>>
}

const ProfileFrom = ({
  userId,
  isLoading,
  setIsLoading,
  setIsOpened,
}: ProfileFromProps) => {
  const router = useRouter()

  //prevent hydration error
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  //states
  // const [isLoading, setIsLoading] = useState(false)
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
      name: "",
    },
  })

  const onSubmit = async (inputData: FormValues) => {
    toast.success("Ukládání dat")
    setIsLoading(true)
    try {
      const respose = await axios.post("/api/profile", {
        ...inputData,
        userId: userId,
      })

      router.refresh()
    } catch (e) {
      toast.error("Data nebyla uložena")
    } finally {
      setIsLoading(false)
      setIsOpened(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-8 border-2 rounded-xl shadow-lg bg-slate-200 max-w-xl w-full mb-4"
      >
        {form.formState.errors.name && (
          <div className="text-red-500 flex justify-center">
            {form.formState.errors.name.message}
          </div>
        )}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="fileName"
          >
            Název profilu
          </label>
          <input
            className="w-full px-3 py-2 border rounded appearance-none focus:outline-none focus:shadow-outline"
            {...form.register("name")}
          />
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
              {citiOptions.map((option) => (
                <option key={option.value} value={option.value}>
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

        <Button
          type="submit"
          className="text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 py-2 px-4 rounded shadow-md flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? "Načítání" : "Vytvořit profil"}
          {isLoading && <div className="animate-spin ml-2">🌀</div>}
        </Button>
      </form>
    </div>
  )
}
export default ProfileFrom
