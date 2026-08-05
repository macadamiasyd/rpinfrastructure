"use client";

import Image from "next/image";
import type { MediaItem } from "@/graphql/generated/graphql";
import { useInView } from "react-intersection-observer";

export default function MediaImage({
  altText: alt,
  mediaDetails,
  sourceUrl,
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

  if (!sourceUrl) return null;

  return (
    <Image
      ref={ref}
      alt={alt || "Image"}
      src={sourceUrl}
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
