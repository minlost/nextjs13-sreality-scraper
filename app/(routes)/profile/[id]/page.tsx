import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import ScrapeClient from "./components/ScrapeClient"

interface ProfilePageProps {
  params: {
    id: string
  }
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const option = await db.scraperProfile.findFirst({
    where: {
      userId: userId,
      id: params.id,
    },
  })

  const scrapeResults = await db.scrapeResult.findMany({
    where: {
      scraperProfileId: params.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  if (!option) {
    return <div>404</div>
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center">
        {Object.entries(option).map(([key, value], index) => {
          if (key === "id") return null

          return (
            <span className="border p-4" key={key}>
              {key} {" : "}
              <span className="font-bold">
                {value instanceof Date ? value.toISOString() : value}
              </span>
            </span>
          )
        })}
      </div>
      <ScrapeClient
        id={params.id}
        option={option}
        scrapeResults={scrapeResults}
      />
    </div>
  )
}

export default ProfilePage
