import type { MetadataRoute } from "next";
import type { Page } from "@/graphql/generated/graphql";
import { PagesSitemapQuery } from "@/graphql/queries";
import { getClient } from "@/lib/api/client";
import { siteUrlFor } from "@/lib/utilities/replaceDomain";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getClient();
  const { data } = await client.query<{ pages: { nodes: Page[] } }>({
    query: PagesSitemapQuery,
    context: { fetchOptions: { next: { tags: ["pages-sitemap"], revalidate: 3600 } } },
  });

  if (!data || data?.pages?.nodes?.length <= 0) {
    return [];
  }

  // Two WordPress pages resolve to "/" (the front page and the posts page), so
  // the root was listed twice. A sitemap should name each URL once.
  const seen = new Set<string>();

  return data?.pages.nodes
    .map((page: Page): MetadataRoute.Sitemap[number] => {
      return {
        // siteUrlFor drops WordPress's trailing slash: `/about/` 308-redirects
        // to `/about`, so the raw uri published an address that bounced.
        url: siteUrlFor(page.uri),
        lastModified: page.modifiedGmt ?? new Date(),
        changeFrequency: "daily",
        priority: 1,
      };
    })
    .filter((entry) => {
      if (seen.has(entry.url)) return false;
      seen.add(entry.url);
      return true;
    });
}
