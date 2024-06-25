"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MobileNav = () => {
  const pathName = usePathname()
  return (
    <Sheet>
      <SheetTrigger>
        <Image
          src={"/icons/hamburger.svg"}
          width={30}
          height={30}
          alt="menu"
          className="cusror-pointer"
        />
      </SheetTrigger>
      <SheetContent className="border-none bg-black-1" side="left">
        <Link
          href=""
          className="flex cursor-pointer items-center gap-1 pb-10 pl-4"
        >
          <Image src={"/icons/logo.svg"} alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white-1 ml-2">Podcastr</h1>
        </Link>
        <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <nav className="flex h-full flex-col gap-6 text-white-1">
              {sidebarLinks.map(
                ({
                  route,
                  label,
                  imgURL,
                }: {
                  route: string
                  label: string
                  imgURL: string
                }) => {
                  const isActive =
                    pathName === route || pathName.startsWith(`${route}/`)

                  return (
                    <SheetClose asChild key={route}>
                      <Link
                        href={route}
                        className={cn(
                          "flex gap-3 items-center py-4 max-lg:px-4 justify-start",
                          {
                            "bg-nav-focus border-r-4 border-orange-1": isActive,
                          }
                        )}
                      >
                        <Image
                          src={imgURL}
                          alt={label}
                          height={24}
                          width={24}
                        />
                        <p>{label} </p>
                      </Link>
                    </SheetClose>
                  )
                }
              )}
            </nav>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
