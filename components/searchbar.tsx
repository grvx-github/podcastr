// File: components/searchbar.tsx

import React, { useState, useEffect } from "react"
import { Input } from "./ui/input"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/lib/useDebounce"

const Searchbar: React.FC = () => {
  const [search, setSearch] = useState("")
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const searchQuery = searchParams.get("search")
    if (searchQuery) {
      setSearch(searchQuery)
    }
  }, [searchParams])

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/discover?search=${debouncedSearch}`)
    } else if (!debouncedSearch && pathName === "/discover") {
      router.push("/discover")
    }
  }, [debouncedSearch, router, pathName])

  return (
    <div className="relative mt-8 block">
      <Input
        className="input-class py-6 pl-12 ring-offset-orange-1"
        placeholder="Search for podcast"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Image
        src={"/icons/search.svg"}
        height={20}
        width={20}
        alt="search"
        className="absolute left-4 top-3.5"
      />
    </div>
  )
}

export default Searchbar
