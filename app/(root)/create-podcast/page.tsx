// /app/create-podcast/page.tsx
"use client"

import PodcastForm from "@/components/podcastForm"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/userContext"

export default function CreatePodcast() {
  const { user, googleSignIn } = useUser()

  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      {user ? (
        <PodcastForm user={user} />
      ) : (
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-4">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold"
            onClick={handleSignIn} // Trigger Google sign-in
          >
            Sign in
          </Button>
        </div>
      )}
    </section>
  )
}
