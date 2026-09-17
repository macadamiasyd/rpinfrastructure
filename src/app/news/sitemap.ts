import type { MetadataRoute } from "next";
import type { Post } from "@/graphql/generated/graphql";
import { NewsSitemapQuery } from "@/graphql/queries/news";
import { getClient } from "@/lib/api/client";
import { siteUrlFor } from "@/lib/utilities/replaceDomain";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getClient();
  const { data } = await client.query<{ posts: { nodes: Post[] } }>({
    query: NewsSitemapQuery,
    context: { fetchOptions: { next: { tags: ["posts-sitemap"], revalidate: 3600 } } },
  });

  if (!data || data?.posts?.nodes?.length <= 0) {
    return [];
  }

  return data.posts.nodes.map((post: Post) => {
    return {
      // siteUrlFor drops WordPress's trailing slash: `/about/` 308-redirects
      // to `/about`, so the raw uri published an address that bounced.
      url: siteUrlFor(post.uri),
      lastModified: post.modifiedGmt ?? new Date(),
      changeFrequency: "daily",
      priority: 1,
    };
  });
}
