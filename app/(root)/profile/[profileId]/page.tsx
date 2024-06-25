"use client"

import { useEffect, useState } from "react"
import EmptyState from "@/components/emptyState"
import LoaderSpinner from "@/components/loaderSpinner"
import PodcastCard from "@/components/podcastCard"
import ProfileCard from "@/components/profileCard"
import { getPodcastByAuthorId } from "@/lib/podcasts"
import { PodcastsData } from "@/types"

interface ProfilePageProps {
  params: {
    profileId: string
  }
}

const ProfilePage: React.FC<ProfilePageProps> = ({ params }) => {
  const [podcastsData, setPodcastsData] = useState<PodcastsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const decodedProfileId = decodeURIComponent(params.profileId)
        const data = await getPodcastByAuthorId(decodedProfileId)
        setPodcastsData(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch podcasts")
        } else {
          setError("Failed to fetch podcasts")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPodcasts()
  }, [params.profileId])

  if (loading) return <LoaderSpinner />
  if (error) return <EmptyState title="Error loading podcasts" />

  if (!podcastsData || podcastsData.podcasts.length === 0) {
  return <EmptyState title="No podcasts found" buttonLink="/create-podcast" />;
}

const user = {
  authorId: podcastsData.podcasts[0]?.authorId ?? "",
  author: podcastsData.podcasts[0]?.author ?? "",
  authorImageUrl: podcastsData.podcasts[0]?.authorImageUrl ?? "",
};
  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData}
          imageUrl={user.authorImageUrl}
          userFirstName={user.author}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData.podcasts.slice(0, 4).map((podcast) => (
              <PodcastCard
                key={podcast.id}
                imgUrl={podcast.imageUrl!}
                title={podcast.podcastTitle}
                description={podcast.podcastDescription}
                podcastId={podcast.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
          />
        )}
      </section>
    </section>
  )
}

export default ProfilePage
