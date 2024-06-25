// lib/podcast.ts

import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  deleteDoc,
  limit,
} from "firebase/firestore"
import { db, storage } from "../firebaseConfig"
import { deleteObject, ref } from "firebase/storage"

import { Podcast } from "@/types"

// Generate podcast audio from a given prompt and voice type
export async function generatePodcastAudio(
  voiceType: string,
  voicePrompt: string
): Promise<Blob | null> {
  try {
    const response = await fetch("/api/generate-podcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: voicePrompt, voice: voiceType }),
    })

    if (!response.ok) {
      const data = await response.json()
      console.error("Error generating podcast:", data.message)
      return null
    }

    const responseData = await response.json()
    if (responseData.audio) {
      const audioBase64 = responseData.audio
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))],
        { type: "audio/mp3" }
      )
      return audioBlob
    } else {
      console.error("No audio data received.")
      return null
    }
  } catch (error) {
    console.error("Error generating podcast:", error)
    return null
  }
}

// Handle the generation of the podcast and provide the audio URL
export async function handleGeneratePodcast(
  voiceType: string,
  voicePrompt: string
): Promise<{
  audioBlob: Blob | null
  audioUrl: string | null
  error: string | null
}> {
  if (!voiceType || !voicePrompt) {
    return {
      audioBlob: null,
      audioUrl: null,
      error: "Please select a voice and enter a prompt.",
    }
  }

  try {
    const audioBlob = await generatePodcastAudio(voiceType, voicePrompt)
    if (!audioBlob) {
      return {
        audioBlob: null,
        audioUrl: null,
        error: "Failed to generate podcast. Please try again.",
      }
    }

    const audioUrl = URL.createObjectURL(audioBlob)
    return { audioBlob, audioUrl, error: null }
  } catch (error) {
    console.error("Error generating podcast:", error)
    return {
      audioBlob: null,
      audioUrl: null,
      error: "Failed to generate podcast. Please try again.",
    }
  }
}

// Fetch all podcasts sorted by views in descending order
export async function getAllPodcasts(): Promise<Podcast[]> {
  try {
    const podcastsCollection = collection(db, "podcasts")
    const podcastsQuery = query(podcastsCollection, orderBy("views", "desc"))
    const podcastSnapshot = await getDocs(podcastsQuery)

    const podcasts: Podcast[] = podcastSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Podcast[]

    return podcasts
  } catch (error) {
    console.error("Error fetching podcasts:", error)
    throw error
  }
}

// Fetch a single podcast by its ID
export async function getPodcastById(
  podcastId: string
): Promise<Podcast | null> {
  try {
    const podcastDocRef = doc(db, "podcasts", podcastId)
    const podcastSnapshot = await getDoc(podcastDocRef)

    if (podcastSnapshot.exists()) {
      return { id: podcastId, ...podcastSnapshot.data() } as Podcast
    } else {
      console.error(`Podcast with ID ${podcastId} not found.`)
      return null
    }
  } catch (error) {
    console.error("Error fetching podcast by ID:", error)
    throw error
  }
}

// Fetch podcasts with the same voice type as the given podcastId
export async function getPodcastsByVoiceType(
  podcastId: string
): Promise<Podcast[]> {
  try {
    // Get the specific podcast to find its voiceType
    const podcastDocRef = doc(db, "podcasts", podcastId);
    const podcastSnapshot = await getDoc(podcastDocRef);

    if (!podcastSnapshot.exists()) {
      console.error(`Podcast with ID ${podcastId} not found.`);
      return [];
    }

    const podcastData = podcastSnapshot.data();
    const voiceType = podcastData?.voiceType;

    if (!voiceType) {
      console.error(`Podcast with ID ${podcastId} does not have a voiceType.`);
      return [];
    }

    // Query to find all podcasts with the same voiceType
    const podcastsQuery = query(
      collection(db, "podcasts"),
      where("voiceType", "==", voiceType)
    );

    const podcastSnapshotByVoiceType = await getDocs(podcastsQuery);

    if (podcastSnapshotByVoiceType.empty) {
      console.error(`No podcasts found with voice type ${voiceType}.`);
      return [];
    }

    // Filter out the current podcast and map the documents to the Podcast type
    return podcastSnapshotByVoiceType.docs
      .filter((doc) => doc.id !== podcastId)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Podcast[];
  } catch (error) {
    console.error("Error fetching podcasts by voice type:", error);
    throw error;
  }
}

// Fetch trending podcasts based on views
export async function getTrendingPodcasts(): Promise<Podcast[]> {
  try {
    const podcastsQuery = query(
      collection(db, "podcasts"),
      orderBy("views", "desc"),
      limit(8)
    )
    const podcastSnapshot = await getDocs(podcastsQuery)

    const podcasts: Podcast[] = podcastSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Podcast[]

    return podcasts
  } catch (error) {
    console.error("Error fetching trending podcasts:", error)
    throw error
  }
}

// Fetch podcasts by the author's ID
export async function getPodcastByAuthorId(
  authorId: string
): Promise<{ podcasts: Podcast[]; listeners: number }> {
  try {
    const podcastsQuery = query(
      collection(db, "podcasts"),
      where("authorId", "==", authorId)
    )
    const podcastSnapshot = await getDocs(podcastsQuery)

    const podcasts: Podcast[] = podcastSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Podcast[]

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    )

    return { podcasts, listeners: totalListeners }
  } catch (error) {
    console.error("Error fetching podcasts by author ID:", error)
    throw error
  }
}

// Function to delete a podcast by its ID and its associated files in Firebase Storage
export async function deletePodcast({
  podcastId,
  imageStorageId,
  audioStorageId,
}: {
  podcastId: string
  imageStorageId: string | null
  audioStorageId: string | null
}): Promise<string> {
  try {
    // Reference to the podcast document in Firestore
    const podcastDocRef = doc(db, "podcasts", podcastId)
    const podcastSnapshot = await getDoc(podcastDocRef)

    if (!podcastSnapshot.exists()) {
      throw new Error(`Podcast with ID ${podcastId} not found.`)
    }

    // Delete associated audio file from Firebase Storage
    if (audioStorageId) {
      const audioRef = ref(storage, audioStorageId)
      await deleteObject(audioRef)
    }

    // Delete associated image file from Firebase Storage
    if (imageStorageId) {
      const imageRef = ref(storage, imageStorageId)
      await deleteObject(imageRef)
    }

    // Delete the podcast document from Firestore
    await deleteDoc(podcastDocRef)

    return `Podcast with ID ${podcastId} successfully deleted.`
  } catch (error) {
    console.error("Error deleting podcast:", error)
    throw error
  }
}

const searchFields = ["author", "podcastTitle", "podcastDescription"]

async function searchPodcastsByField(
  field: string,
  searchTerm: string,
  maxResults: number = 10
): Promise<Podcast[]> {
  const podcastsCollection = collection(db, "podcasts")
  const searchQuery = query(
    podcastsCollection,
    where(field, ">=", searchTerm),
    where(field, "<=", searchTerm + "\uf8ff"), // Ensures prefix matching
    limit(maxResults)
  )

  const snapshot = await getDocs(searchQuery)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Podcast[]
}

export async function searchPodcasts(searchTerm: string): Promise<Podcast[]> {
  for (const field of searchFields) {
    const results = await searchPodcastsByField(field, searchTerm)
    if (results.length > 0) return results
  }
  return []
}
