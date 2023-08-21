import { DataTable } from "@/components/ui/DataTable"
import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { columns } from "./components/Columns"
import RefreshButton from "./components/RefreshButton"

export default async function WatchedPage() {
  const { userId } = auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const propertyWatcher = await db.propertyWatcher.findFirst({
    where: {
      userId,
    },
    include: {
      watchedProperyWatched: {
        include: { priceList: true },
      },
    },
  })

  const createWatcher = async () => {
    try {
      const newWatcher = await db.propertyWatcher.create({
        data: {
          userId,
        },
      })
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  if (!propertyWatcher) {
    await createWatcher()
  }

  if (propertyWatcher?.watchedProperyWatched.length === 0) {
    return (
      <div className="text-center text-3xl text-neutral-400">
        <h1>Není nic sledováno</h1>
      </div>
    )
  }
  const transformedData = propertyWatcher?.watchedProperyWatched.map((item) => {
    let sortedPriceList = item.priceList
    try {
      sortedPriceList = item.priceList.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        if (dateA instanceof Date && dateB instanceof Date) {
          return dateA.getTime() - dateB.getTime()
        }
        return 0
      })
    } catch (e) {
      console.error("Error sorting priceList:", e)
    }

    return {
      title: item.title,
      price: item.price,
      address: item.address,
      url: item.url,
      isPriceChanged: item.isPriceChanged,
      priceList: sortedPriceList,
      id: item.id,
      propertyWatcherId: propertyWatcher.id,
    }
  })

  return (
    <div>
      {propertyWatcher && (
        <div className="flex justify-end m-2">
          <RefreshButton propertyWatcher={propertyWatcher} />{" "}
        </div>
      )}
      <DataTable columns={columns} data={transformedData || []} />
    </div>
  )
}
