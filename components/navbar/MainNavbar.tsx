"use client"

import { cn } from "@/utils/utils"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { FC } from "react"

const MainNav: FC = ({}) => {
  const pathname = usePathname()

  const { userId } = useAuth()
  const routes = [
    {
      href: `/`,
      label: "Home",
      active: pathname === `/`,
    },
    {
      href: `/custom`,
      label: "Cutom Scrape",
      active: pathname === `/custom`,
    },
  ]

  const authRoutes = [
    {
      href: `/`,
      label: "Home",
      active: pathname === `/`,
    },
    {
      href: `/custom`,
      label: "Custom Scrape",
      active: pathname === `/custom`,
    },
    {
      href: `/profile`,
      label: "Profil",
      active: pathname === `/profile`,
    },
    {
      href: `/watched`,
      label: "Watched",
      active: pathname === `/watched`,
    },
  ]

  return (
    <nav className="mx-6 flex justify-center items-center space-x-4 lg:space-x-6 ">
      {userId
        ? authRoutes.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              className={cn(
                "text-lg font-medium hover:text-black",
                route.active ? "text-balck" : "text-neutral-500"
              )}
            >
              {route.label}
            </Link>
          ))
        : routes.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              className={cn(
                "text-lg font-medium hover:text-black",
                route.active ? "text-balck" : "text-neutral-500"
              )}
            >
              {route.label}
            </Link>
          ))}
    </nav>
  )
}

export default MainNav
