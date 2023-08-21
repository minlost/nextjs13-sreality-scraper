import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "No user id provided" }, { status: 400 })
  }

  const { name, city, sort, pages, rooms, minPrice, maxPrice } = body

  try {
    const profile = await db.scraperProfile.create({
      data: {
        userId,
        name,
        city,
        sort,
        rooms,
        minPrice,
        maxPrice,
        pages,
      },
    })
    return new Response(JSON.stringify(profile))
  } catch (e) {
    return NextResponse.json(
      { error: "Could not create profile" },
      { status: 400 }
    )
  }
}

export async function DELETE(req: Request) {
  const { userId } = auth()
  const { id } = await req.json()

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

  try {
    const profile = await db.scraperProfile.delete({
      where: {
        id,
      },
    })
    return new Response(JSON.stringify(profile))
  } catch (e) {
    return NextResponse.json(
      { error: "Could not delete profile" },
      { status: 400 }
    )
  }
}
