"use client";

import { useRef, useState } from "react";
import type { CarouselSlides, Post } from "@/graphql/generated/graphql";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";

import MediaImage from "../shared/media/image";

import "swiper/css";

type Props = {
  carousel?: Post["carousel"];
  featuredImage?: Post["featuredImage"];
  hasCaption?: boolean;
};

export default function PostCarousel({ featuredImage, carousel, hasCaption = false }: Props) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [active, setActive] = useState(1);
  const totalSlides = (featuredImage?.node ? 1 : 0) + ((carousel?.slides?.length ?? 0) as number);

  return (
    <section className={clsx("Carousel", { "Carousel--captioned": hasCaption })}>
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
        {featuredImage?.node && (
          <SwiperSlide>
            <div className="Carousel-imgWrap">
              <MediaImage {...featuredImage.node} />
            </div>
          </SwiperSlide>
        )}
        {carousel?.slides &&
          carousel?.slides.length > 0 &&
          (carousel.slides as CarouselSlides[]).map(({ image }, index) => (
            <SwiperSlide key={index}>
              {image && image.node && image.node.sourceUrl && (
                <div className="Carousel-imgWrap">
                  <MediaImage {...image.node} />
                </div>
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
