import { db } from "@/utils/client/prismaDb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

async function scrapePage(url: string) {
  const browser = await puppeteer.launch()

  const page = await browser.newPage()
  await page.goto(url)

  await page.waitForTimeout(2500)

  const price = await page.$$eval(".norm-price.ng-binding", (elements) =>
    elements.map((element) => element.textContent)
  )
  if (price[0] === null) {
    return null
  }
  const formatedPrice = parseInt(
    price[0].replace(/\s+/g, "").replace("Kč", ""),
    10
  )

  browser.close()

  return formatedPrice
}

export async function POST(
  req: Request,
  { params }: { params: { watchedPropertyId: string } }
) {
  const body = await req.json()
  const { propertyWatcherId, url } = body
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  const watcherProfile = await db.propertyWatcher.findFirst({
    where: { userId, id: propertyWatcherId },
  })

  if (!watcherProfile) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (params.watchedPropertyId === undefined || !url) {
    return NextResponse.json(
      { error: "watchedPropertyId or url not found" },
      { status: 404 }
    )
  }

  const price = await scrapePage(url)
  if (price === null) {
    return NextResponse.json({ error: "Price not found" }, { status: 404 })
  }

  const scrapeResultValueWatched = await db.scrapeResultValueWatched.findUnique(
    {
      where: {
        id: params.watchedPropertyId,
      },
    }
  )
  if (!scrapeResultValueWatched) {
    return NextResponse.json(
      { error: "ScrapeResultValueWatched not found" },
      { status: 404 }
    )
  }

  const newScrapedPrice = await db.scrapedPrice.create({
    data: {
      price: price,
      scrapeResultValueWatchedId: scrapeResultValueWatched.id,
    },
  })
  if (!newScrapedPrice) {
    return NextResponse.json(
      { error: "ScrapedPrice not created" },
      { status: 404 }
    )
  }
  return NextResponse.json({ data: newScrapedPrice }, { status: 200 })
}
