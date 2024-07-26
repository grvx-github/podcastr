// /app/create-podcast/page.tsx
"use client"

import PodcastForm from "@/components/podcastForm"
import { useUser } from "@/context/userContext"

export default function CreatePodcast() {
  const { user } = useUser()

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      {user ? <PodcastForm user={user} /> : (
        <div className="text-center">
          <p>Please sign in to create a podcast.</p>
        </div>
      )}
    </section>
  )
}
