import { PodcastCardProps } from "@/types"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const PodcastCard = ({
  imgUrl,
  title,
  description,
  podcastId,
  author,
  authorImageUrl,
  views,
  createdAt,
}: PodcastCardProps) => {
  return (
    <Link href={`/podcasts/${podcastId}`}>
      <figure className="flex flex-col gap-1 bg-black-5 rounded-lg">
        <div className="px-4 pt-2 flex justify-start items-center overflow-hidden gap-3">
          <Avatar className="w-10 rounded-full h-full md:h-10">
            <AvatarImage src={authorImageUrl} alt="User image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center items-start gap-1 h-16">
            <h1 className="text-lg leading-5 font-bold text-white-1 line-clamp-2">
              {title}
            </h1>

            <span className="text-gray-1 text-xs">{author}</span>
          </div>
        </div>
        <Image
          src={imgUrl}
          width={200}
          height={200}
          alt="title"
          className="aspect-square h-fit w-full 2xl:size-[200px] object-cover"
        />
        <div className="px-4 pb-2 text-wrap h-12 leading-none overflow-hidden">
          <h2 className="line-clamp-2 text-12 font-normal text-white-4">
            {createdAt && (
              <span className="text-white-2 mr-2">
                {createdAt?.toDate.toLocaleString()}
              </span>
            )}

            <span className="text-12 text-white-2 font-semibold mr-2">
              {views} views
            </span>

            {description}
          </h2>
        </div>
      </figure>
    </Link>
  )
}

export default PodcastCard
