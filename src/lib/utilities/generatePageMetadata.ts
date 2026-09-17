import type { Metadata } from "next";
import type { PostTypeSeo, TaxonomySeo } from "@/graphql/generated/graphql";

import { replaceDomain, siteUrlFor } from "./replaceDomain";

/**
 * Build a page's metadata from its Yoast SEO payload.
 *
 * `canonicalPath` is the path this route actually serves. Pass it wherever the
 * route knows its own address, which is everywhere except the preview screen.
 * It sets both og:url and the canonical link, because Yoast reports the
 * WordPress permalink and the two disagree in ways that break link previews:
 *
 *  - every WP permalink has a trailing slash, so the advertised og:url
 *    308-redirected on each fetch; and
 *  - the project taxonomies are registered under the blog base, so Yoast gave
 *    `/news/sectors/education/` for a page that lives at `/sectors/education`.
 *    That og:url dead-ended in a 404, and a crawler following it — LinkedIn,
 *    Slack, Facebook — got nothing to build a card from.
 */
export const generatePageMetadata = (
  source?: PostTypeSeo | TaxonomySeo | null,
  canonicalPath?: string
): Metadata => {
  const filterUndefined = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

  const canonical = canonicalPath ? siteUrlFor(canonicalPath) : undefined;

  const twitter = filterUndefined({
    title: source?.twitterTitle,
    description: source?.twitterDescription,
    images: source?.twitterImage?.sourceUrl,
  });
  const openGraph = filterUndefined({
    type: source?.opengraphType ?? "website",
    title: source?.opengraphTitle,
    description: source?.opengraphDescription,
    // Prefer the route's own address; fall back to Yoast only where the caller
    // has none to give.
    url: canonical ?? (source?.opengraphUrl ? replaceDomain(source.opengraphUrl) : undefined),
    siteName: source?.opengraphSiteName,
    images: source?.opengraphImage?.sourceUrl,
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
    // Only declare a canonical where we know the real address. A guessed one
    // is worse than none.
    alternates: canonical ? { canonical } : undefined,
    openGraph: Object.keys(openGraph).length > 0 ? openGraph : undefined,
    twitter: Object.keys(twitter).length > 0 ? twitter : undefined,
  };
};
