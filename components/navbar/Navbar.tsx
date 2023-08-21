import React from "react"
import MainNav from "./MainNavbar"
import { Shadows_Into_Light_Two } from "next/font/google"
import { cn } from "@/utils/utils"
import { UserButton, auth } from "@clerk/nextjs"
import Link from "next/link"

const shadow = Shadows_Into_Light_Two({ subsets: ["latin"], weight: "400" })
const Navbar = () => {
  const { userId } = auth()

  return (
    <div className="flex flex-col gap-5">
      <div className="absolute top-1 right-5">
        <UserButton afterSignOutUrl="/" />
        {!userId && <Link href="/sign-in">Sign in</Link>}
      </div>
      <MainNav />
      <div className="text-center">
        <h1 className={cn("text-4xl ", shadow.className)}>
          <span className="text-red-600 ">S</span>REALITY SCRAPE v.1.0
        </h1>
      </div>
    </div>
  )
}

export default Navbar
