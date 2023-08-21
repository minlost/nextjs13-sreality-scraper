import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismaDb = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaDb

export const db = prismaDb
