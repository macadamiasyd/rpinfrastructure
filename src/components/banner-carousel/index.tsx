"use client";

import Link from "next/link";
import type { AcfCarousel, CarouselSlides } from "@/graphql/generated/graphql";
import { normalizeAppHref, replaceDomain } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";
import clsx from "clsx";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";

import MediaImage from "@/components/shared/media/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  carousel?: AcfCarousel["carousel"];
  hasCaption?: boolean;
  extraClass?: string;
  options?: SwiperOptions;
};

const defaultOptions: SwiperOptions = {
  modules: [Pagination, Navigation, Autoplay],
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  // `autoplay: true` uses Swiper's 3s default, which was too quick to read a
  // headline plus caption. Pause on hover so a slide can be read in full.
  autoplay: {
    delay: 6500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  speed: 700,
  pagination: {
    enabled: true,
    clickable: true,
  },
  navigation: {
    enabled: true,
  },
};

export default function BannerCarousel({
  carousel,
  hasCaption = false,
  extraClass = "",
  options = defaultOptions,
}: Props) {
  return (
    <section
      className={clsx(
        "Home-carousel-new js-homeCarousel-exprt",
        { "Carousel--captioned": hasCaption },
        extraClass
      )}
    >
      <Swiper {...options}>
        {carousel?.slides &&
          carousel?.slides.length > 0 &&
          (carousel.slides as CarouselSlides[]).map(
            ({ image, title, caption, ctaLabel, link, linkToProject }, index) => {
              const linkNode = link?.nodes?.[0];
              let ctaHref: string | null = null;
              if (linkNode) {
                if (linkToProject) {
                  const slug = (linkNode as any)?.slug;
                  ctaHref = slug ? `/project/${slug}` : (linkNode?.uri ?? null);
                } else {
                  ctaHref = linkNode?.uri ?? null;
                }
              }
              const internal = ctaHref
                ? normalizeAppHref(ctaHref)
                : { href: null, isInternal: false };
              return (
                <SwiperSlide key={index} className="Banner">
                  <div className="Banner-slide">
                    {hasCaption && (
                      <div className="Banner-caption">
                        <div className="row h100">
                          <div className="column h100 relative cus_expert_banner_txtsec">
                            <h2
                              className="Banner-title u-staggerIn"
                              dangerouslySetInnerHTML={{ __html: sanitizeHTML(title ?? "") }}
                            />
                            <div
                              className="Banner-text u-staggerIn"
                              dangerouslySetInnerHTML={{ __html: sanitizeHTML(caption ?? "") }}
                            />
                            {internal.isInternal && internal.href ? (
                              <Link className="Banner-cta u-staggerIn" href={internal.href}>
                                {ctaLabel ?? "View project"}
                                <svg className="Icon Icon-arrow-right">
                                  <use xlinkHref="#icon-arrow-right" />
                                </svg>
                              </Link>
                            ) : ctaHref ? (
                              <a
                                className="Banner-cta u-staggerIn"
                                href={replaceDomain(ctaHref)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {ctaLabel ?? "View project"}
                                <svg className="Icon Icon-arrow-right">
                                  <use xlinkHref="#icon-arrow-right" />
                                </svg>
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}
                    {image && image.node && image.node.guid && (
                      <MediaImage {...image.node} className="img-cover" />
                    )}
                  </div>
                </SwiperSlide>
              );
            }
          )}
      </Swiper>
    </section>
  );
}
