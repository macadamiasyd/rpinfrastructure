import type { MetadataRoute } from "next";
import type { Page } from "@/graphql/generated/graphql";
import { PagesSitemapQuery } from "@/graphql/queries";
import { getClient } from "@/lib/api/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getClient();
  const { data } = await client.query<{ pages: { nodes: Page[] } }>({
    query: PagesSitemapQuery,
    context: { fetchOptions: { next: { tags: ["posts-sitemap"], revalidate: 3600 } } },
  });

  if (!data || data?.pages?.nodes?.length <= 0) {
    return [];
  }

  return data?.pages.nodes.map((page: Page) => {
    return {
      url: `${process.env.PUBLIC_URL}${page.uri}`,
      lastModified: page.modifiedGmt ?? new Date(),
      changeFrequency: "daily",
      priority: 1,
    };
  });
}
