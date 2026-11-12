"use client";

import Image from "next/image";
import type { MediaItem } from "@/graphql/generated/graphql";
import { useInView } from "react-intersection-observer";

/**
 * Vector sources gain nothing from the optimizer, and next/image rejects remote
 * SVGs outright unless `dangerouslyAllowSVG` is set — which we don't want for
 * editor-uploaded files. They're passed through untouched instead.
 */
const isVector = (url: string) => /\.svgz?(?:[?#]|$)/i.test(url);

export default function MediaImage({
  altText: alt,
  mediaDetails,
  sourceUrl,
  mediaItemUrl,
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
   * Worth passing wherever the rendered width is much smaller than the source:
   * without it next/image sizes the srcSet from the intrinsic width, so a
   * 2560px original offered to a 700px slot fetches far more than it needs.
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

  const width = Number(mediaDetails?.width) || 0;
  const height = Number(mediaDetails?.height) || 0;
  const hasIntrinsicSize = width > 0 && height > 0;
  const classes = `${className ?? ""} ${inView ? "is-inView" : ""}`;

  // Everything routable goes through the optimizer: it re-encodes to WebP/AVIF,
  // caps the delivered pixels at the device sizes, and serves from the frontend
  // CDN rather than the WordPress origin. That origin has no CDN in front of it
  // and is the only source of imagery on the site, so going direct made every
  // page depend on it — and let a 25MB upload ship to visitors untouched.
  //
  // Two cases can't take that path: vectors, and attachments WordPress gave us
  // no dimensions for (next/image needs width and height to reserve space and
  // to build a srcSet). Those fall back to the file as-is.
  if (!hasIntrinsicSize || isVector(url)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        alt={alt || "Image"}
        src={url}
        width={hasIntrinsicSize ? width : undefined}
        height={hasIntrinsicSize ? height : undefined}
        loading={priority ? "eager" : loading}
        fetchPriority={fetchPriority}
        className={classes}
      />
    );
  }

  return (
    <Image
      ref={ref}
      alt={alt || "Image"}
      src={url}
      width={width}
      height={height}
      sizes={responsiveSizes}
      quality={85}
      {...(priority ? { priority: true } : { loading })}
      fetchPriority={fetchPriority}
      className={classes}
    />
  );
}
