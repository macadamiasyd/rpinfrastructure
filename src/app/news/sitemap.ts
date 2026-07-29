import type { MetadataRoute } from "next";
import type { Post } from "@/graphql/generated/graphql";
import { NewsSitemapQuery } from "@/graphql/queries/news";
import { getClient } from "@/lib/api/client";
import { getSiteUrl } from "@/lib/utilities/replaceDomain";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getClient();
  const { data } = await client.query<{ posts: { nodes: Post[] } }>({
    query: NewsSitemapQuery,
    context: { fetchOptions: { next: { tags: ["posts-sitemap"], revalidate: 3600 } } },
  });

  if (!data || data?.posts?.nodes?.length <= 0) {
    return [];
  }

  const siteUrl = getSiteUrl();

  return data.posts.nodes.map((post: Post) => {
    return {
      url: `${siteUrl}${post.uri}`,
      lastModified: post.modifiedGmt ?? new Date(),
      changeFrequency: "daily",
      priority: 1,
    };
  });
}
