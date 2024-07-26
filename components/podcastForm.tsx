// components/PodcastForm.tsx

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader } from "lucide-react"
import { Input } from "@/components/ui/input"
import { handleGeneratePodcast } from "@/lib/actions/podcasts.actions"
import { storage, db, auth } from "../firebaseConfig"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { collection, addDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import GenerateThumbnail from "./generte-thumbnail"
import cleanVoicePrompt from "@/lib/cleanVoicePrompt"
import { onAuthStateChanged } from "firebase/auth"

const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescriptions: z.string().min(2),
  voiceType: z.string().nonempty(),
  voicePrompt: z.string().min(2),
})

const PodcastForm: React.FC<{ user: any }> = ({ user }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [image, setImage] = useState<string>("")
  const [authUser, setAuthUser] = useState<any>(null)

  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user)
      } else {
        setAuthUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescriptions: "",
      voiceType: "",
      voicePrompt: "",
    },
  })

  async function handleFormSubmit() {
    const values = form.getValues()
    setIsGenerating(true)

    const cleanedVoicePrompt = cleanVoicePrompt(values.voicePrompt)

    const { audioBlob, audioUrl, error } = await handleGeneratePodcast(
      values.voiceType,
      cleanedVoicePrompt
    )

    if (error) {
      alert(error)
    } else if (audioUrl) {
      setAudioUrl(audioUrl)
      setAudioBlob(audioBlob)
    }

    setIsGenerating(false)
  }

  async function savePodcast(e: { preventDefault: () => void }) {
    setIsSaving(true)
    e.preventDefault()

    if (!audioBlob || !image) {
      toast({
        title: "Please generate audio/thumbnail to save.",
        variant: "destructive",
      })
      setIsSaving(false)
      return
    } else if (!authUser?.email) {
      toast({ title: "User not authenticated.", variant: "destructive" })
      return
    }

    try {
      const fileName = `${uuidv4()}.mp3`
      const audioRef = ref(storage, `podcasts/${authUser.email}/${fileName}`)
      await uploadBytes(audioRef, audioBlob)
      const downloadUrl = await getDownloadURL(audioRef)

      const values = form.getValues()
      const currentTimestamp = new Date().toISOString()

      const podcastData = {
        user: authUser.email,
        podcastTitle: values.podcastTitle,
        podcastDescription: values.podcastDescriptions,
        audioUrl: downloadUrl,
        audioStorageId: audioRef.fullPath,
        author: authUser?.displayName || "Unknown",
        authorId: authUser.email,
        authorImageUrl: authUser?.photoURL || "",
        voicePrompt: values.voicePrompt,
        voiceType: values.voiceType,
        imageUrl: image,
        audioDuration: 0,
        views: 0,
        createdAt: currentTimestamp,
      }

      await addDoc(collection(db, "podcasts"), podcastData)
      setAudioUrl(null)
      setImage("")
      toast({
        title: "Podcast saved!",
      })
      setIsSaving(false)
    } catch (error) {
      console.error("Error saving podcast:", error)
      toast({
        title: "Failed to save podcast.",
        description: (error as Error).message,
        variant: "destructive",
      })
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="mt-12 flex w-full flex-col"
      >
        <div className="flex flex-col gap-[30px] border-b border-black-5 pb-8">
          <FormField
            control={form.control}
            name="podcastTitle"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Podcast Title
                </FormLabel>
                <FormControl className="input-class focus-visible:ring-offset-orange-1">
                  <Input placeholder="Podcast" {...field} />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="podcastDescriptions"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Description
                </FormLabel>
                <FormControl className="input-class focus-visible:ring-offset-orange-1">
                  <Textarea
                    placeholder="Write a short podcast description"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voiceType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Select AI Voice
                </FormLabel>
                <FormControl className="input-class focus-visible:ring-offset-orange-1">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1">
                      <SelectValue
                        placeholder="Select AI Voice"
                        className="placeholder:text-gray-1"
                      />
                    </SelectTrigger>
                    <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus-visible:ring-offset-orange-1">
                      <SelectItem
                        className="capitalize focus:bg-orange-1"
                        value="en-US_AllisonV3Voice"
                      >
                        Allison (US English)
                      </SelectItem>
                      <SelectItem
                        className="capitalize focus:bg-orange-1"
                        value="en-GB_JamesV3Voice"
                      >
                        James (UK English)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voicePrompt"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  Voice Prompt
                </FormLabel>
                <FormControl className="input-class focus-visible:ring-offset-orange-1">
                  <Textarea
                    placeholder="Type the prompt for your podcast"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />
          <div className="flex flex-col">
            <div className="w-fit ml-auto">
              <Button
                type="button"
                onClick={handleFormSubmit}
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    Generating
                    <Loader size={20} className="animate-spin ml-2" />{" "}
                  </>
                ) : (
                  "Generate Podcast"
                )}
              </Button>
            </div>
          </div>
        </div>

        {audioUrl && (
          <div className="mt-4 flex gap-4">
            <audio
              controls
              src={audioUrl}
              onError={(e) => {
                console.error("Error playing audio:", e)
                alert("There was an error playing the audio. Please try again.")
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <GenerateThumbnail image={image} setImage={setImage} />
        <Button
          onClick={savePodcast}
          className="text-16 mt-4 bg-orange-1 hover:bg-black-1 py-2 px-4 font-bold text-white-1"
        >
          {isSaving ? " Saving..." : "Save Podcast"}
        </Button>
      </form>
    </Form>
  )
}

export default PodcastForm
