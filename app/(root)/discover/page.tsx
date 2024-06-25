// /app/root/discover/page.tsx

"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import EmptyState from "@/components/emptyState"
import LoaderSpinner from "@/components/loaderSpinner"
import { searchPodcasts } from "@/lib/podcasts"
import PodcastCard from "@/components/podcastCard"
import Searchbar from "@/components/searchbar"
import { Podcast } from "@/types"

const DiscoverComp: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[] | null>(null)
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  )
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  useEffect(() => {
    const fetchPodcasts = async () => {
      setStatus("loading")
      try {
        const results = await searchPodcasts(searchQuery)
        setPodcasts(results)
        setStatus("success")
      } catch (error) {
        console.error("Failed to fetch podcasts:", error)
        setStatus("error")
      }
    }

    fetchPodcasts()
  }, [searchQuery])

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9 h-full">
        <h1 className="text-20 font-bold text-white-1">
          {!searchQuery ? "Discover Trending Podcasts" : `Search results for: `}
          {searchQuery && <span className="text-white-2">{searchQuery}</span>}
        </h1>
        {status === "loading" && <LoaderSpinner />}
        {status === "error" && (
          <div className="text-red-500">Failed to load podcasts.</div>
        )}
        {status === "success" &&
          (podcasts && podcasts.length > 0 ? (
            <div className="podcast_grid">
              {podcasts.map((podcast) => (
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
            <EmptyState title="No results found" />
          ))}
      </div>
    </div>
  )
}

export default function Discover() {
  return (
    <Suspense fallback={<LoaderSpinner />}>
      <DiscoverComp />
    </Suspense>
  )
}
