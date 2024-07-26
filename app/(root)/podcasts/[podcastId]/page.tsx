// app/podcast/[podcastId]/page.tsx
"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import {
  getPodcastById,
  getPodcastsByVoiceType,
} from "@/lib/actions/podcasts.actions"
import PodcastDetailPlayer from "@/components/podcastDetailPlayer"
import LoaderSpinner from "@/components/loaderSpinner"
import PodcastCard from "@/components/podcastCard"
import { Podcast } from "@/types"
import EmptyState from "@/components/emptyState"
import { useUser } from "@/context/userContext"

interface PodcastDetailsProps {
  params: { podcastId: string }
}

const PodcastDetails: React.FC<{ params: { podcastId: string } }> = ({
  params,
}) => {
  const { user } = useUser()
  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [similarPodcasts, setSimilarPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const isOwner = user?.email === podcast?.authorId

  useEffect(() => {
    const fetchData = async () => {
      const podcastData = await getPodcastById(params.podcastId)
      setPodcast(podcastData)
      const similarPodcastsData = await getPodcastsByVoiceType(params.podcastId)
      setSimilarPodcasts(similarPodcastsData)
      setLoading(false)
    }

    fetchData()
  }, [params.podcastId])

  if (loading) return <LoaderSpinner />

  if (!similarPodcasts || !podcast) return <LoaderSpinner />

  return (
    <section className="flex flex-col w-full">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3 ">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast.views}</h2>
        </figure>
      </header>
      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast.id}
        {...podcast}
      />
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-left">
        {podcast.podcastDescription}
      </p>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.voicePrompt}
          </p>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts &&
              similarPodcasts?.map(
                ({
                  id,
                  podcastDescription,
                  imageUrl,
                  podcastTitle,
                  author,
                  authorImageUrl,
                }: Podcast) => (
                  <PodcastCard
                    key={id}
                    imgUrl={imageUrl!}
                    title={podcastTitle}
                    description={podcastDescription}
                    podcastId={id}
                    author={author}
                    authorImageUrl={authorImageUrl}
                  />
                )
              )}
          </div>
        ) : (
          <EmptyState
            title={"No similar podcasts found"}
            buttonLink="/discover"
            buttonText="Discover More Podcasts"
          />
        )}
      </section>
    </section>
  )
}
export default PodcastDetails
