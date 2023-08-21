import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "No user id provided" }, { status: 400 })
  }

  const profile = await db.scraperProfile.findFirst({
    where: { id, userId },
  })

  if (!profile) {
    return NextResponse.json(
      { error: "No profile found for this user" },
      { status: 400 }
    )
  }

  if (!params.id) {
    return NextResponse.json({ error: "No id provided" }, { status: 400 })
  }

  const profileByUserId = await db.scraperProfile.findFirst({
    where: { userId, id: params.id },
  })

  if (!profileByUserId) {
    return NextResponse.json(
      { error: "No profile found for this user" },
      { status: 400 }
    )
  }

  try {
    const profile = await db.scraperProfile.deleteMany({
      where: {
        id,
      },
    })
    return NextResponse.json(profile)
  } catch (e) {
    return NextResponse.json(
      { error: "Could not delete profile" },
      { status: 400 }
    )
  }
}
