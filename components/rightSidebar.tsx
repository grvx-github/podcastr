// /components/RightSidebar.tsx

import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import UserButton from "./userButton"
import Image from "next/image"
import Header from "./header"
import Carousel from "./carousel"
import { useRouter } from "next/navigation"
import { Podcast, TopUser } from "@/types"
import { getTrendingPodcasts } from "@/lib/actions/podcasts.actions"
import { getTopUsersByPodcastCount } from "@/lib/actions/users.actions"
import { useUser } from "@/context/userContext"

const RightSidebar: React.FC = () => {
  const router = useRouter()
  const { user, googleSignIn } = useUser()

  // Updated state to store TopUser objects
  const [trendingPodcasts, setTrendingPodcasts] = useState<{
    loading: boolean
    error: string | null
    podcasts: Podcast[]
  }>({
    loading: true,
    error: null,
    podcasts: [],
  })

  const [topUsersState, setTopUsersState] = useState<{
    loading: boolean
    error: string | null
    topUsers: TopUser[]
  }>({
    loading: true,
    error: null,
    topUsers: [],
  })

  useEffect(() => {
    const fetchTrendingPodcasts = async () => {
      try {
        const result = await getTrendingPodcasts()
        setTrendingPodcasts({ loading: false, error: null, podcasts: result })
      } catch (error) {
        console.error("Error fetching top users:", error)
        setTrendingPodcasts({
          loading: false,
          error: "Failed to load top users.",
          podcasts: [],
        })
      }
    }

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

    fetchTrendingPodcasts()
    fetchTopUsers()
  }, [])

  // Memoize the onClick handler to avoid re-creation on every render
  const handleProfileClick = useCallback(
    (userId: string) => {
      router.push(`/profile/${userId}`)
    },
    [router]
  )

  if (trendingPodcasts.error) {
    return <div>Error: {trendingPodcasts.error}</div>
  }


  return (
    <section className="right_sidebar text-white-1">
      {user ? (
        <Link href={`/profile/${user.email}`} className="flex gap-3 pb-12">
          <UserButton imgUrl={user.photoURL || "/path/to/default/image.png"} />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user.displayName}
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
        <div
          className="flex gap-3 pb-12 w-full justify-between cursor-pointer"
          onClick={() => googleSignIn()}
        >
          <h1 className="text-16 font-semibold text-orange-1 ">
            Please log in
          </h1>
          <Image
            src={"/icons/right-arrow.svg"}
            alt="arrow"
            width={24}
            height={24}
          />
        </div>
      )}

      <section>
        <Header headerTitle="Fans also like" />
        <Carousel fansLikeDetail={trendingPodcasts.podcasts} />
      </section>

      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcasters" />
        <div className="flex flex-col gap-6">
          {topUsersState.topUsers.slice(0, 4).map((item) => (
            <div
              key={item.authorId}
              className="flex cursor-pointer justify-between"
              onClick={() => handleProfileClick(item.authorId)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={item.authorImageUrl}
                  alt={item.author}
                  height={30}
                  width={30}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">
                  {item.author}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal">
                  {item.podcastCount} Podcasts
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
