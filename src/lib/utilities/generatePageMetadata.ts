import type { Metadata } from "next";
import type { PostTypeSeo, TaxonomySeo } from "@/graphql/generated/graphql";

export const generatePageMetadata = (source?: PostTypeSeo | TaxonomySeo | null): Metadata => {
  const twitter = {
    title: source?.twitterTitle ?? undefined,
    description: source?.twitterDescription ?? undefined,
    images: source?.twitterImage?.guid ?? undefined,
  };
  const openGraph = {
    type: source?.opengraphType ?? undefined,
    title: source?.opengraphTitle ?? undefined,
    description: source?.opengraphDescription ?? undefined,
    url: source?.opengraphUrl ?? undefined,
    siteName: source?.opengraphSiteName ?? undefined,
    images: source?.opengraphImage?.guid ?? undefined,
    modifiedTime: source?.opengraphModifiedTime ?? undefined,
  };
  const robots = {
    index: true,
    follow: true,
  };
  if (source?.metaRobotsNoindex === "noindex") {
    robots.index = false;
  }
  if (source?.metaRobotsNofollow === "nofollow") {
    robots.follow = false;
  }
  return {
    description: source?.metaDesc ?? "",
    robots,
    openGraph,
    twitter,
  };
};
