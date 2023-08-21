import puppeteer from "puppeteer"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { NextResponse } from "next/server"

interface ScrapedData {
  title?: string | null
  address?: string | null
  price?: string | null
  url?: string | null
}

let data: ScrapedData[] = []

function saveToCSV(data: ScrapedData[], fileName: string) {
  const id = uuidv4()
  const header = ["title", "address", "price", "url"]
  const csv = [
    header.join(","),
    ...data.map((row) => `${row.title},${row.address},${row.price},${row.url}`),
  ].join("\n")

  fs.writeFileSync(`data/${fileName}${"_" + id}.csv`, csv)
}

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
  console.log(
    `${BASE_URL}${"&velikost=" + rooms}${"&razeni=" + sort}${
      "&cena-od=" + minPrice
    }${"&cena-do=" + maxPrice}${"&strana="}${pageNumber}`
  )

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
      title: content,
      address: address[index] || null,
      price: price[index] || null,
      url: url[index] || null,
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
  maxPrice: number,
  fileName: string
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
      pages++
      if (result.length === 0) break
      data.push(...result)
      pages++
    }
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
  await saveToCSV(data, fileName)
}

export async function POST(req: Request) {
  data = []
  const body = await req.json()
  const { city, sort, pages, rooms, minPrice, maxPrice, fileName } = body
  if (!city || !sort || pages === undefined || !rooms || !fileName) {
    return new Response(
      JSON.stringify({
        message: "City, sort and pages parameters are required",
      }),
      { status: 400 }
    )
  }

  await scrapeAllPages(city, sort, pages, rooms, minPrice, maxPrice, fileName)
  return NextResponse.json(data, { status: 200 })
}
