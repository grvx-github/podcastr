// File: components/EmblaCarousel.tsx

import React, { useCallback, useMemo } from "react"
import useEmblaCarousel, { UseEmblaCarouselType } from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { DotButton, useDotButton } from "./emblaCarouselDotButton"
import { CarouselProps } from "@/types"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { EmblaCarouselType } from "embla-carousel"

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

  // Memoize the rendering of carousel items
  const carouselItems = useMemo(
    () =>
      fansLikeDetail.slice(0, 5).map((item) => (
        <figure
          key={item.podcastTitle}
          className="carousel_box pt-4"
          onClick={() => router.push(`/podcasts/${item.id}`)}
        >
          <Image
            src={item.imageUrl!}
            alt="card"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 12vw"
            className="absolute size-full rounded-xl border-none object-cover"
          />
          <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
            <h2 className="text-14 font-semibold text-white-1">
              {item.podcastTitle}
            </h2>
          </div>
        </figure>
      )),
    [fansLikeDetail, router]
  )

  return (
    <section
      className="flex w-full overflow-hidden gap-8 flex-col"
      ref={emblaRef}
    >
      <div className="flex">{carouselItems}</div>

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
