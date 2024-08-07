// /app/layout.tsx
"use client"
import LeftSidebar from "@/components/leftSidebar"
import MobileNav from "@/components/mobileNav"
import RightSidebar from "@/components/rightSidebar"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import PodcastPlayer from "@/components/podcastPlayer"
import { UserProvider } from "@/context/userContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Wrap only once at the top level
  return (
    <UserProvider>
      <div className="relative flex flex-col">
        <main className="relative flex bg-black-3">
          <LeftSidebar />
          <section className=" flex min-h-screen flex-1 flex-col px-4 sm:px-8 ">
            <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
              <div className="flex h-16 items-center justify-between md:hidden ">
                <Image
                  src="/icons/logo.svg"
                  width={30}
                  height={30}
                  alt="menu icon"
                />
                <MobileNav />
              </div>
              <div className=" flex flex-col md:pb-14 pb-8">
                <Toaster />
                {children}
              </div>
            </div>
          </section>
          <RightSidebar />
        </main>
        <PodcastPlayer />
      </div>
    </UserProvider>
  )
}
