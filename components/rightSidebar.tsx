// File: components/RightSidebar.tsx

import React, { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useSession, signIn } from "next-auth/react"
import UserButton from "./userButton"
import Image from "next/image"
import Header from "./header"
import Carousel from "./carousel"
import { getTopUsersByPodcastCount } from "@/lib/users"
import { UserPodcasts } from "@/types"
import { useRouter } from "next/navigation"

const RightSidebar: React.FC = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user

  const [topUsersState, setTopUsersState] = useState<{
    loading: boolean
    error: string | null
    topUsers: UserPodcasts[]
  }>({
    loading: true,
    error: null,
    topUsers: [],
  })

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const result = await getTopUsersByPodcastCount()
        setTopUsersState({ loading: false, error: null, topUsers: result })
      } catch (error) {
        console.error("Error fetching top users:", error)
        setTopUsersState({
          loading: false,
          error: "Failed to load top users.",
          topUsers: [],
        })
      }
    }

    fetchTopUsers()
  }, [])

  // Memoize the sorted top users to avoid unnecessary re-renders
  const topUsers = useMemo(
    () => topUsersState.topUsers,
    [topUsersState.topUsers]
  )

  // Memoize the onClick handler to avoid re-creation on every render
  const handleProfileClick = useCallback(
    (userId: string) => {
      router.push(`/profile/${userId}`)
    },
    [router]
  )

  if (topUsersState.error) {
    return <div>Error: {topUsersState.error}</div>
  }

  return (
    <section className="right_sidebar text-white-1">
      {user ? (
        <Link href={`/profile/${user.email}`} className="flex gap-3 pb-12">
          <UserButton imgUrl={user.image || "/path/to/default/image.png"} />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user.name}
            </h1>
            <Image
              src={"/icons/right-arrow.svg"}
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      ) : (
        <div className="flex gap-3 pb-12 w-full justify-between cursor-pointer" onClick={() => signIn('google')}>
          <h1 className="text-16 font-semibold text-orange-1 ">Please log in</h1>
          <Image
            src={"/icons/right-arrow.svg"}
            alt="arrow"
            width={24}
            height={24}
          />
        </div>
      )}

      <section>
        <Header headerTitle="Fans like you" />
        {topUsers.length > 0 ? (
          topUsers.map((topUser) => (
            <div key={topUser.userId} className="pt-4">
              <Carousel fansLikeDetail={topUser.podcasts} />
            </div>
          ))
        ) : (
          <div>No top users found.</div>
        )}
      </section>

      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-6">
          {topUsers.slice(0, 4).map((item) => (
            <div
              key={item.userId}
              className="flex cursor-pointer justify-between"
              onClick={() => handleProfileClick(item.userId)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={item.podcasts[0].authorImageUrl}
                  alt={item.podcasts[0].author}
                  height={30}
                  width={30}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">
                  {item.podcasts[0].author}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal">
                  {item.podcasts.length} Podcasts
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default RightSidebar
