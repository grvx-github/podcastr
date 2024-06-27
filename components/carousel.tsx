// File: components/EmblaCarousel.tsx

import React, { useCallback } from "react"
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { DotButton, useDotButton } from "./emblaCarouselDotButton"
import { Podcast } from "@/types" // Import TopUser type
import { useRouter } from "next/navigation"
import Image from "next/image"
import { EmblaCarouselType } from "embla-carousel"

// Define the updated CarouselProps interface
interface CarouselProps {
  fansLikeDetail: Podcast[]
}

const EmblaCarousel: React.FC<CarouselProps> = ({ fansLikeDetail }) => {
  const router = useRouter()

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (autoplay) {
      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop
      resetOrStop()
    }
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  return (
    <section
      className="flex w-full overflow-hidden gap-8 flex-col mt-4"
      ref={emblaRef}
    >
      <div className="flex">
        {fansLikeDetail.slice(0, 5).map((item) => (
          <figure
            key={item.authorId}
            className="carousel_box pt-4"
            onClick={() => router.push(`/profile/${item.authorId}`)}
          >
            <Image
              src={item.imageUrl!}
              alt={item.podcastTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 24vw, 20vw"
              className="absolute size-full rounded-xl border-none object-cover"
            />
            <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4 py-2">
              <h2 className="text-14 font-semibold text-white-1 line-clamp-1">
                {item.podcastTitle}
              </h2>
              <p className="text-12 font-normal text-white-2">
                {item.views} Listens
              </p>
            </div>
          </figure>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  )
}

export default EmblaCarousel
