"use client";

import { useRef, useState } from "react";
import type { PortfolioOptionsSlides } from "@/graphql/generated/graphql";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";

import MediaImage from "../shared/media/image";

import "swiper/css";

import Link from "next/link";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

type Props = {
  slides?: PortfolioOptionsSlides[];
};

export default function ProjectsCarousel({ slides }: Props) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [active, setActive] = useState(1);

  if (!slides || slides?.length === 0) {
    return null;
  }

  return (
    <section
      className={clsx(
        "Carousel",
        "Carousel--captioned",
        "Carousel--portfolio",
        "u-bounceUp",
        "is-inView",
        "u-spaceBeforeHuge"
      )}
    >
      <h2 className="show-for-sr">Featured projects</h2>
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
        {slides.map((slide, index) => {
          const { image, ctaLabel, caption, title, linkToProject, link } = slide;

          const node = link?.nodes?.[0];
          const slug = node?.slug;
          const uri = node?.uri;
          const ctaHref = linkToProject
            ? slug
              ? `/project/${slug}`
              : (uri ?? null)
            : (uri ?? null);

          return (
            <SwiperSlide key={index} className="Carousel-slide">
              {image && image.node && (
                <div className="Carousel-imgWrap">
                  <MediaImage {...image.node} />
                </div>
              )}
              <div className="Carousel-caption">
                {title && <h4 dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
                {caption && <h4 dangerouslySetInnerHTML={{ __html: sanitizeHTML(caption) }} />}
                {ctaHref ? (
                  <Link href={ctaHref} className="u-linkForward">
                    {ctaLabel ?? "View project"}
                    <svg className="Carousel-arrow Icon Icon-arrow-right">
                      <use xlinkHref="#icon-arrow-right" />
                    </svg>
                  </Link>
                ) : null}
                {slides.length > 1 && (
                  <div className="Carousel-counter Carousel-counter--caption">
                    <span
                      className="Carousel-navItem js-carousel-prev"
                      onClick={() => swiperRef.current?.slidePrev()}
                    >
                      &lt;
                    </span>{" "}
                    <span className="js-carousel-counter">
                      {active} / {slides.length}
                    </span>{" "}
                    <span
                      className="Carousel-navItem js-carousel-next"
                      onClick={() => swiperRef.current?.slideNext()}
                    >
                      &gt;
                    </span>
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {slides.length > 1 && (
        <div className="Carousel-counter">
          <span
            className="Carousel-navItem js-carousel-prev"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            &lt;
          </span>{" "}
          <span className="js-carousel-counter">
            {active} / {slides.length}
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
