/* eslint-disable no-unused-vars */

import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { Dispatch, SetStateAction } from "react"

// Define the EmptyStateProps interface for components that show an empty state
export interface EmptyStateProps {
  title: string
  search?: boolean
  buttonText?: string
  buttonLink?: string
}

export interface TopUser {
  author: string
  authorId: string
  authorImageUrl: string
  podcastCount: number
}

// Define the TopPodcastersProps interface to represent top podcasters
export interface TopPodcastersProps {
  podcastTitle: string | null | undefined
  id: string // User document ID
  name: string
  email: string
  imageUrl: string
  totalPodcasts: number
  podcast: {
    podcastTitle: string
    podcastId: string // Podcast document ID
  }[]
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date // or firebase.firestore.Timestamp, depending on how you store it
  profilePicture?: string // optional field
  // Add other fields as needed
}

// Define the PodcastProps interface for a podcast including metadata
export interface PodcastProps {
  id: string // Firebase document ID
  creationTime: number
  audioStorageId: string | null // Firebase Storage reference ID for audio
  user: string // User document ID
  podcastTitle: string
  podcastDescription: string
  audioUrl: string | null
  imageUrl: string | null
  imageStorageId: string | null // Firebase Storage reference ID for image
  author: string // Author's name
  authorId: string // User ID from Firebase Auth or Firestore
  authorImageUrl: string
  voicePrompt: string
  imagePrompt: string | null
  voiceType: string
  audioDuration: number
  views: number
}

export interface Podcast extends PodcastProps {
  // If there are additional properties that are unique to Podcast, add them here
}

export interface PodcastsData {
  podcasts: Podcast[]
  listeners: number
}

// Corrected UserPodcasts interface to match the expected type
export interface UserPodcasts {
  userId: string
  podcasts: Podcast[]
}

// Define the PodcastDetailsProps interface for podcast detail components
export interface PodcastDetailsProps {
  podcast: Podcast
  similarPodcasts: Podcast[]
}

// Define the ProfilePodcastProps interface to represent podcasts in a user's profile
export interface ProfilePodcastProps {
  podcasts: PodcastProps[]
  listeners: number
}
export interface ProfilePageProps {
  params: {
    profileId: string
  }
}

// Define the LatestPodcastCardProps interface for a podcast card in a list
export interface LatestPodcastCardProps {
  imgUrl: string
  title: string
  duration: string
  index: number
  audioUrl: string
  author: string
  views: number
  podcastId: string // Podcast document ID
}

// Define the PodcastDetailPlayerProps interface for the podcast player component
export interface PodcastDetailPlayerProps {
  audioUrl: string | null // Changed from string to string | null
  podcastTitle: string
  author: string
  isOwner: boolean
  imageUrl: string | null // Adjusted if you need to handle similar null case
  podcastId: string
  imageStorageId: string | null
  audioStorageId: string | null
  authorImageUrl: string
  authorId: string
}

// Define the AudioProps interface for audio data
export interface AudioProps {
  title: string
  audioUrl: string
  author: string
  imageUrl: string
  podcastId: string // Podcast document ID
}

// Define the AudioContextType interface for the audio context
export interface AudioContextType {
  audio: AudioProps | undefined
  setAudio: Dispatch<SetStateAction<AudioProps | undefined>>
}

// Define the PodcastCardProps interface for a podcast card
export interface PodcastCardProps {
  imgUrl: string
  title: string
  description: string
  podcastId: string // Podcast document ID
}

// Define the CarouselProps interface for the carousel component
export interface CarouselProps {
  fansLikeDetail: PodcastProps[]
}

// Define the ProfileCardProps interface for a user profile card
export interface ProfileCardProps {
  podcastData: ProfilePodcastProps
  imageUrl: string
  userFirstName: string
}

// Define the UseDotButtonType interface for controlling dot buttons in a carousel
export type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}
