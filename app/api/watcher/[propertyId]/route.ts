import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { propertyId: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  const { propertyId } = params

  const profileResultValue = await db.scrapeResultValue.findFirst({
    where: {
      id: propertyId,
    },
  })
  if (!profileResultValue) {
    return NextResponse.json(
      { error: "No property found for this id" },
      { status: 400 }
    )
  }

  const propertyWatcher = await db.propertyWatcher.findFirst({
    where: {
      userId,
    },
  })

  if (!propertyWatcher) {
    return NextResponse.json(
      { error: "No watcher found for this user" },
      { status: 400 }
    )
  }

  const propertyWatcherPropertyCheck = await db.propertyWatcher.findFirst({
    where: {
      userId,
      watchedProperty: {
        some: {
          url: profileResultValue.url,
        },
      },
    },
  })

  if (propertyWatcherPropertyCheck) {
    return NextResponse.json(
      { error: "Property already being watched" },
      { status: 400 }
    )
  }

  const addPropertyToWatcher = await db.propertyWatcher.update({
    where: {
      id: propertyWatcher.id,
    },
    data: {
      watchedProperty: {
        connect: {
          id: propertyId,
        },
      },
    },
  })

  const newProperty = await db.scrapeResultValueWatched.create({
    data: {
      address: profileResultValue.address,
      price: profileResultValue.price,
      scrapedPrice: profileResultValue.price,
      isPriceChanged: false,
      url: profileResultValue.url,
      title: profileResultValue.title,
    },
  })

  const addPropertyToWatcherProperty = await db.propertyWatcher.update({
    where: {
      id: propertyWatcher.id,
    },
    data: {
      watchedProperyWatched: {
        connect: {
          id: newProperty.id,
        },
      },
    },
  })

  return NextResponse.json(addPropertyToWatcherProperty)
}

export async function DELETE(
  req: Request,
  { params }: { params: { propertyId: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }
  const { propertyId } = params

  const body = await req.json()
  const { propertyWatcherId } = body

  const watcherProfile = await db.propertyWatcher.findFirst({
    where: { userId, id: propertyWatcherId },
  })

  if (!watcherProfile) {
    return NextResponse.json(
      { error: "No watcher found for this user" },
      { status: 400 }
    )
  }

  try {
    const profileResultValue = await db.scrapeResultValueWatched.deleteMany({
      where: {
        id: propertyId,
      },
    })
    return NextResponse.json(profileResultValue)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "No property found for this id" },
      { status: 500 }
    )
  }
}
