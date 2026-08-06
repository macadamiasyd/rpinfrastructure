"use client";

import Image from "next/image";
import type { MediaItem } from "@/graphql/generated/graphql";
import { useInView } from "react-intersection-observer";

export default function MediaImage({
  altText: alt,
  mediaDetails,
  sourceUrl,
  mediaItemUrl,
  priority = false,
  loading = "lazy",
  fetchPriority = "auto",
  className,
}: MediaItem & {
  priority?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "auto" | "high" | "low";
  className?: string;
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
