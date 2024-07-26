"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { sidebarLinks } from "@/constants"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useUser } from "@/context/userContext"

const LeftSidebar = () => {
  const { user, googleSignIn, logOut } = useUser()

  const pathName = usePathname()

  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="left_sidebar h-screen">
      <nav className="flex flex-col gap-6">
        <Link
          href=""
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src={"/icons/logo.svg"} alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            Podcastr
          </h1>
        </Link>

        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive =
            pathName === route || pathName.startsWith(`${route}/`)

          return (
            <Link
              key={label}
              href={route}
              className={cn(
                "flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",
                { "bg-nav-focus border-r-4 border-orange-1": isActive }
              )}
            >
              <Image src={imgURL} alt={label} height={24} width={24} />
              <p>{label} </p>
            </Link>
          )
        })}
      </nav>
      {user ? (
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-4">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold"
            onClick={handleSignOut}
          >
            Log Out
          </Button>
        </div>
      ) : (
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-4">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold"
            onClick={handleSignIn} // Trigger Google sign-in
          >
            Sign in
          </Button>
        </div>
      )}
    </section>
  )
}

export default LeftSidebar
