import type { Metadata } from "next";
import type { PostTypeSeo, TaxonomySeo } from "@/graphql/generated/graphql";

import { replaceDomain } from "./replaceDomain";

export const generatePageMetadata = (source?: PostTypeSeo | TaxonomySeo | null): Metadata => {
  const filterUndefined = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
  const twitter = filterUndefined({
    title: source?.twitterTitle,
    description: source?.twitterDescription,
    images: source?.twitterImage?.guid,
  });
  const openGraph = filterUndefined({
    type: source?.opengraphType ?? "website",
    title: source?.opengraphTitle,
    description: source?.opengraphDescription,
    url: source?.opengraphUrl ? replaceDomain(source?.opengraphUrl) : undefined,
    siteName: source?.opengraphSiteName,
    images: source?.opengraphImage?.guid,
    modifiedTime: source?.opengraphModifiedTime,
  });
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
    openGraph: Object.keys(openGraph).length > 0 ? openGraph : undefined,
    twitter: Object.keys(twitter).length > 0 ? twitter : undefined,
  };
};
