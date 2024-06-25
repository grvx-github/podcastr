// app/create-podcast/page.js
import PodcastForm from "@/components/podcastForm"
import { authConfig } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { signIn } from "next-auth/react" // Import the signIn function from next-auth/react
import { redirect } from "next/navigation"

export default async function CreatePodcast() {
  const session = await getServerSession(authConfig)

  if (!session) {
    // If there's no session, redirect to sign-in page
    redirect("/api/auth/signin?callbackUrl=/create-podcast")
    return null // Ensure nothing is rendered
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <PodcastForm session={session} />
    </section>
  )
}
