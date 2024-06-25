// /lib/users.ts

import {
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore"
import { db } from "../firebaseConfig"
import { Podcast, UserPodcasts } from "@/types"

export async function getTopUsersByPodcastCount(): Promise<UserPodcasts[]> {
  try {
    const podcastsCollection = collection(db, "podcasts")
    const podcastSnapshot = await getDocs(podcastsCollection)

    if (podcastSnapshot.empty) {
      console.log("No podcasts found in the database.")
      return []
    }

    // Aggregate podcasts by authorId
    const userPodcastMap = new Map<string, Podcast[]>()

    podcastSnapshot.forEach((doc) => {
      const podcastData = doc.data() as Podcast
      const { authorId } = podcastData

      if (authorId) {
        if (!userPodcastMap.has(authorId)) {
          userPodcastMap.set(authorId, [])
        }
        userPodcastMap.get(authorId)!.push(podcastData)
      } else {
        console.warn(`Document ${doc.id} is missing 'authorId' field.`)
      }
    })

    // Convert the map to an array and sort by podcast count in descending order
    const sortedUsers: UserPodcasts[] = Array.from(userPodcastMap.entries())
      .map(([userId, podcasts]) => ({ userId, podcasts }))
      .sort((a, b) => b.podcasts.length - a.podcasts.length)

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
