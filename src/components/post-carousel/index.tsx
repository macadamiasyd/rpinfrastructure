"use client";

import { useRef, useState } from "react";
import type { CarouselSlides, Post } from "@/graphql/generated/graphql";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";

import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "../shared/media/image";

import "swiper/css";

type Props = {
  carousel?: Post["carousel"];
  featuredImage?: Post["featuredImage"];
  hasCaption?: boolean;
};

export default function PostCarousel({ featuredImage, carousel, hasCaption }: Props) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [active, setActive] = useState(1);
  // The featured image is a fallback, not a first slide. Where a post has its
  // own carousel images it was appearing ahead of them — a duplicate hero, and
  // served at LARGE (800px) while the slides come through at full size, so it
  // also read as noticeably softer than everything after it.
  const slideCount = (carousel?.slides?.length ?? 0) as number;
  const showFeatured = Boolean(featuredImage?.node) && slideCount === 0;
  const totalSlides = (showFeatured ? 1 : 0) + slideCount;

  // Captions were styled but never rendered, so anything typed into the media
  // library's Caption field simply vanished. Drive the modifier off the content
  // rather than a prop no caller was passing.
  const anyCaption =
    hasCaption ??
    Boolean(
      (showFeatured && featuredImage?.node?.caption) ||
        (carousel?.slides ?? []).some((s) => (s as CarouselSlides)?.image?.node?.caption)
    );

  // With nothing to show this still rendered the section, the Swiper and the
  // styling — an empty box on the page.
  if (totalSlides === 0) return null;

  return (
    <section className={clsx("Carousel", { "Carousel--captioned": anyCaption })}>
      <Swiper
        className="Carousel-carousel"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActive(swiper.realIndex + 1);
        }}
        onSlideChange={(swiper) => {
          setActive(swiper.realIndex + 1);
        }}
        loop={true}
      >
        {showFeatured && featuredImage?.node && (
          <SwiperSlide>
            <div className="Carousel-imgWrap">
              <MediaImage {...featuredImage.node} responsiveSizes="(max-width: 640px) 100vw, 1200px" />
            </div>
            {featuredImage.node.caption && (
              <div
                className="Carousel-caption"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(featuredImage.node.caption) }}
              />
            )}
          </SwiperSlide>
        )}
        {carousel?.slides &&
          carousel?.slides.length > 0 &&
          (carousel.slides as CarouselSlides[]).map(({ image }, index) => (
            <SwiperSlide key={index}>
              {image && image.node && image.node.sourceUrl && (
                <>
                  <div className="Carousel-imgWrap">
                    <MediaImage {...image.node} />
                  </div>
                  {image.node.caption && (
                    <div
                      className="Carousel-caption"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(image.node.caption) }}
                    />
                  )}
                </>
              )}
            </SwiperSlide>
          ))}
      </Swiper>
      {totalSlides > 1 && (
        <div className="Carousel-counter">
          <span
            className="Carousel-navItem js-carousel-prev"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            &lt;
          </span>{" "}
          <span className="js-carousel-counter">
            {active} / {totalSlides}
          </span>{" "}
          <span
            className="Carousel-navItem js-carousel-next"
            onClick={() => swiperRef.current?.slideNext()}
          >
            &gt;
          </span>
        </div>
      )}
    </section>
  );
}
