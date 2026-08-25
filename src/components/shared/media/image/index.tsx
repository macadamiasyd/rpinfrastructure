"use client";

import Image from "next/image";
import type { MediaItem } from "@/graphql/generated/graphql";
import { useInView } from "react-intersection-observer";

export default function MediaImage({
  altText: alt,
  mediaDetails,
  sourceUrl,
  mediaItemUrl,
  srcSet,
  responsiveSizes,
  priority = false,
  loading = "lazy",
  fetchPriority = "auto",
  className,
}: MediaItem & {
  priority?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "auto" | "high" | "low";
  className?: string;
  /**
   * How wide this image actually renders, e.g. "(max-width: 640px) 100vw, 1200px".
   * Opting in is deliberate: WordPress supplies a `sizes` value describing the
   * size chosen on insert, and every grid and card consumes the same fragment —
   * switching them all to srcSet with a careless hint would have the browser
   * fetch the largest candidate for a thumbnail.
   */
  responsiveSizes?: string;
}) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "-10% 0%",
    triggerOnce: true,
  });

  // sourceUrl is the right field for images — it resolves through the registered
  // sizes. mediaItemUrl is the plain file URL and only matters as a fallback for
  // attachments that have no image sizes at all.
  const url = sourceUrl ?? mediaItemUrl;
  if (!url) return null;

  // next/image is running unoptimized here, which means it emits a single src
  // and drops any srcSet — so a hero rendered from the LARGE size (800px on
  // this site) was upscaled and looked soft. Where WordPress has given us
  // candidates, render them directly and let the browser choose. `sizes` must
  // be passed by the caller: WordPress writes it from the size chosen on
  // insert, which is almost never how we actually display the image.
  if (srcSet && responsiveSizes) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        alt={alt || "Image"}
        src={url}
        srcSet={srcSet}
        sizes={responsiveSizes}
        width={Number(mediaDetails?.width) || undefined}
        height={Number(mediaDetails?.height) || undefined}
        loading={priority ? "eager" : loading}
        fetchPriority={fetchPriority}
        className={`${className ?? ""} ${inView ? "is-inView" : ""}`}
      />
    );
  }

  return (
    <Image
      ref={ref}
      alt={alt || "Image"}
      src={url}
      width={Number(mediaDetails?.width)}
      height={Number(mediaDetails?.height)}
      quality={100}
      loading={loading}
      priority={priority}
      fetchPriority={fetchPriority}
      className={`${className ?? ""} ${inView ? "is-inView" : ""}`}
      unoptimized={true}
    />
  );
}
