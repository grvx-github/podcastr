// app/create-podcast/page.js
import PodcastForm from "@/components/podcastForm"
import { authConfig } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation" // Import the redirect function


export default async function CreatePodcast() {
  const session = await getServerSession(authConfig)

  if (!session) {
    redirect("/sign-in") // Redirect to login if no session
    return null // Return null to stop rendering
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <PodcastForm session={session} />
    </section>
  )
}
