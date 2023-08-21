import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { id: string; resultId: string; resultValueId: string } }
) {
  const { id, resultId, resultValueId } = await params

  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated", status: 401 })
  }

  const profile = await db.scraperProfile.findFirst({
    where: { id, userId },
  })

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized", status: 401 })
  }

  if (!params.id) {
    return NextResponse.json({ error: "Unauthorized", status: 401 })
  }

  const profileByUserId = await db.scraperProfile.findFirst({
    where: { userId, id: params.id },
  })

  if (!profileByUserId) {
    return NextResponse.json({ error: "Unauthorized", status: 401 })
  }

  try {
    const profileResultValue = await db.scrapeResultValue.deleteMany({
      where: {
        id: resultValueId,
      },
    })
    return NextResponse.json(profileResultValue)
  } catch (e) {
    return NextResponse.json({ error: e, status: 500 })
  }
}
