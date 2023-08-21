import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; resultId: string } }
) {
  const { id, resultId } = await params
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json("Unauthenticated", { status: 401 })
  }

  const profile = await db.scraperProfile.findFirst({
    where: { id, userId },
  })

  if (!profile) {
    return NextResponse.json("Unauthorized", { status: 401 })
  }

  if (!params.id) {
    return NextResponse.json("Unauthorized", { status: 401 })
  }

  const profileByUserId = await db.scraperProfile.findFirst({
    where: { userId, id: params.id },
  })

  if (!profileByUserId) {
  }

  try {
    //in profile need to find ScrapeResult and delete it
    const profileResult = await db.scrapeResult.deleteMany({
      where: {
        id: resultId,
      },
    })
    return NextResponse.json(profileResult, { status: 200 })
  } catch (e) {
    console.log(e)
  }
}
