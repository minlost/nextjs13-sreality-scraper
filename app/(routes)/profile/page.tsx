import { DataTable } from "@/components/ui/DataTable"
import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import NewProfile from "./[id]/result/[resultId]/components/NewProfile"
import { columns } from "./components/Columns"

export default async function ProfilePage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const options = await db.scraperProfile.findMany({
    where: {
      userId: userId,
    },
  })

  if (options.length === 0) {
    return (
      <>
        <NewProfile userId={userId} />
      </>
    )
  }

  return (
    <div>
      <div className="flex justify-center mb-5">
        <NewProfile userId={userId} />
      </div>
      <div className="flex justify-center items-center">
        <DataTable columns={columns} data={options} />
      </div>
    </div>
  )
}
