import puppeteer from "puppeteer"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/utils/client/prismaDb"
import { create } from "domain"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

interface ScrapedData {
  title: string
  address: string
  price: string
  url: string
}

let data: ScrapedData[] = []

async function scrapePage(
  pageNumber: number,
  city: string,
  sort: string,
  rooms: string,
  minPrice: number,
  maxPrice: number
): Promise<ScrapedData[]> {
  const BASE_URL = `https://www.sreality.cz/hledani/prodej/byty/${city}?`
  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.goto(
    `${BASE_URL}${"&velikost=" + rooms}${"&razeni=" + sort}${
      "&cena-od=" + minPrice
    }${"&cena-do=" + maxPrice}${"&strana="}${pageNumber}`
  )

  await page.waitForTimeout(Number(process.env.SCRAPE_TIMEOUT))

  const url = await page.$$eval(".title", (elements) =>
    elements.map((element) => element.getAttribute("ng-href")).filter(Boolean)
  )

  const title = await page.$$eval(".name.ng-binding", (elements) =>
    elements.map((element) => element.textContent)
  )
  const address = await page.$$eval(".locality.ng-binding", (elements) =>
    elements.map((element) => element.textContent)
  )

  const price = await page.$$eval(".norm-price.ng-binding", (elements) =>
    elements.map((element) => element.textContent)
  )

  const pageData: ScrapedData[] = []

  title.forEach((content, index) => {
    if (index === 0) return
    pageData.push({
      title: content || "",
      address: address[index] || "",
      price: price[index] || "",
      url: url[index] || "",
    })
  })

  await browser.close()

  return pageData
}

async function scrapeAllPages(
  city: string,
  sort: string,
  pages: number,
  rooms: string,
  minPrice: number,
  maxPrice: number
) {
  const totalNumberOfPages = pages
  if (pages === 0) {
    pages = 1
    while (true) {
      const result = await scrapePage(
        pages,
        city,
        sort,
        rooms,
        minPrice,
        maxPrice
      )
      if (result.length === 0) break
      data.push(...result)
      pages++
    }
    return
  }

  for (let pageNumber = 1; pageNumber <= totalNumberOfPages; pageNumber++) {
    const pageData = await scrapePage(
      pageNumber,
      city,
      sort,
      rooms,
      minPrice,
      maxPrice
    )
    data.push(...pageData)
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "No user id provided" }, { status: 400 })
  }

  const profile = await db.scraperProfile.findFirst({
    where: { id: params.id, userId },
  })

  if (!profile) {
    return NextResponse.json(
      { error: "No profile found for this user" },
      { status: 400 }
    )
  }

  const body = await req.json()

  const { city, sort, pages, rooms, minPrice, maxPrice } = body.option

  data = []

  if (!city || !sort || pages === undefined || !rooms) {
    return new Response(JSON.stringify({ "Missing data": body }), {
      status: 400,
    })
  }

  await scrapeAllPages(city, sort, pages, rooms, minPrice, maxPrice)

  const transformedListings = data.map((listing) => {
    const numericPrice = parseInt(
      listing.price.replace(/\s+/g, "").replace("Kč", ""),
      10
    )

    return { ...listing, price: numericPrice }
  })

  try {
    const result = await db.scrapeResult.create({
      data: {
        scraperProfile: {
          connect: {
            id: params.id,
          },
        },
        scrapeResultValue: {
          create: transformedListings.map((listing) => ({
            title: listing.title,
            address: listing.address,
            price: listing.price,
            url: listing.url,
          })),
        },
      },
    })
    const resultResult = await db.scrapeResult.findUnique({
      where: {
        id: result.id,
      },
      include: {
        scrapeResultValue: {
          orderBy: {
            price: "desc",
          },
        },
      },
    })
    return new Response(JSON.stringify(resultResult))
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot create scrape result" },
      { status: 500 }
    )
  }
}
