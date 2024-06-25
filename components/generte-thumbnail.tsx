// components/generate-thumbnail.tsx
"use client"
import React, { useRef, useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Loader } from "lucide-react"
import { Input } from "./ui/input"
import Image from "next/image"
import { useToast } from "./ui/use-toast"
import { storage } from "@/firebaseConfig"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

interface GenerateThumbnailProps {
  image: string
  setImage: (url: string) => void
}

const GenerateThumbnail: React.FC<GenerateThumbnailProps> = ({
  image,
  setImage,
}) => {
  const { toast } = useToast()
  const [isImageLoading, setIsImageLoading] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null)

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true)
    setImage("")

    try {
      const file = new File([blob], fileName, { type: "image/png" })
      const imageRef = ref(storage, `thumbnails/${fileName}`)
      await uploadBytes(imageRef, file)
      const downloadUrl = await getDownloadURL(imageRef)

      setIsImageLoading(false)
      setImage(downloadUrl)
      toast({ title: "Thumbnail generated successfully" })
    } catch (error) {
      console.log(error)
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      })
    }
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      const files = e.target.files
      if (!files) return
      const file = files[0]
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]))

      handleImage(blob, file.name)
    } catch (error) {
      console.log(error)
      toast({ title: "Error uploading image", variant: "destructive" })
    }
  }

  return (
    <>
      <div className="mt-4">
        <Label className="text-16 font-bold text-white-1">
          Upload Thumbnail
        </Label>
      </div>

      <div
        className="image_div"
        onClick={() => {
          imageRef?.current?.click()
        }}
      >
        <Input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={(e) => uploadImage(e)}
        />
        {!isImageLoading ? (
          <Image
            src="/icons/upload-image.svg"
            height={40}
            width={40}
            alt="upload"
          />
        ) : (
          <div className="text-16 flex-center font-medium text-white-1">
            Uploading
            <Loader size={20} className="animate-spin ml-2" />
          </div>
        )}
        <div className="flex flex-col items-center gap-1 ">
          <h2 className="text-12 font-bold text-orange-1">Click to Upload</h2>
          <p className="text-12 font-normal text-gray-1">
            SVG, PNG, or GIF (max 1080x1080px)
          </p>
        </div>
      </div>

      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            alt="thumbnail"
            className="mt-5"
          />
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail
