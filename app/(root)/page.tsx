// app/page.tsx or pages/index.tsx (for Next.js 13+ with server components)

import React from "react"
import { getAllPodcasts } from "@/lib/actions/podcasts.actions"
import { Podcast } from "@/types"
import PodcastCard from "@/components/podcastCard"

export default async function Home() {
  const podcasts: Podcast[] = await getAllPodcasts()
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5 ">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="podcast_grid">
          {podcasts.map(
            ({
              id,
              podcastDescription,
              imageUrl,
              podcastTitle,
              author,
              authorImageUrl,
              views,
              createdAt,
            }) => (
              <PodcastCard
                key={id}
                imgUrl={imageUrl!}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={id}
                author={author}
                authorImageUrl={authorImageUrl}
                createdAt={createdAt}
                views={views}
              />
            )
          )}
        </div>
      </section>
    </div>
  )
}