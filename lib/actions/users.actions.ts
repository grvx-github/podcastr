// /lib/users.ts

'use server'

import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { Podcast, TopUser } from "@/types"

export async function getTopUsersByPodcastCount(): Promise<TopUser[]> {
  try {
    // Fetch the podcasts collection from Firestore
    const podcastsCollection = collection(db, "podcasts")
    const podcastSnapshot = await getDocs(podcastsCollection)

    if (podcastSnapshot.empty) {
      console.log("No podcasts found in the database.")
      return []
    }

    // Aggregate podcasts by authorId with the relevant fields
    const userPodcastMap = new Map<
      string,
      { author: string; authorImageUrl: string; podcastCount: number }
    >()

    podcastSnapshot.forEach((doc) => {
      const podcastData = doc.data() as Podcast
      const { author, authorId, authorImageUrl } = podcastData

      if (authorId && author && authorImageUrl) {
        if (!userPodcastMap.has(authorId)) {
          userPodcastMap.set(authorId, {
            author,
            authorImageUrl,
            podcastCount: 0,
          })
        }
        // Increment the podcast count for the author
        userPodcastMap.get(authorId)!.podcastCount += 1
      } else {
        console.warn(`Document ${doc.id} is missing required fields.`)
      }
    })

    // Convert the map to an array and sort by podcast count in descending order
    const sortedUsers: TopUser[] = Array.from(userPodcastMap.entries())
      .map(([authorId, { author, authorImageUrl, podcastCount }]) => ({
        author,
        authorId,
        authorImageUrl,
        podcastCount,
      }))
      .sort((a, b) => b.podcastCount - a.podcastCount)

    return sortedUsers
  } catch (error) {
    console.error("Error fetching users sorted by podcast count:", error)
    throw error
  }
}

// Function to get author details by authorId from Firestore
export const getUserById = async (
  authorId: string
): Promise<{ author: string; authorImageUrl: string } | null> => {
  try {
    // Query the "podcasts" collection to find the first document where authorId matches
    const podcastsCollectionRef = collection(db, "podcasts")
    const querySnapshot = await getDocs(
      query(podcastsCollectionRef, where("authorId", "==", authorId))
    )

    if (querySnapshot.empty) {
      console.error(`No document found with authorId '${authorId}'`)
      return null
    }

    // Get the first document that matches the query
    const docSnapshot = querySnapshot.docs[0]
    const podcastData = docSnapshot.data() as Podcast

    // Extract author and authorImageUrl from the document data
    const author = podcastData.author ?? ""
    const authorImageUrl = podcastData.authorImageUrl ?? ""

    return { author, authorImageUrl }
  } catch (error) {
    console.error("Error fetching author details:", error)
    throw error
  }
}
