import type { AcfCarousel } from "@/graphql/generated/graphql";

import BannerCarousel from "@/components/banner-carousel";

export default function CarouselBlock({ attributes, carousel }: AcfCarousel) {
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const slides = carousel?.slides ?? [];
  if (!slides.length) return null;

  const hasCaption = slides.some((s) => Boolean(s?.caption || s?.title));

  return <BannerCarousel carousel={carousel} hasCaption={hasCaption} extraClass={extraClass} />;
}
