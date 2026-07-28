import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next/types";
import type { Post } from "@/graphql/generated/graphql";
import { NewsSitemapQuery, PostQuery, PostSeoQuery } from "@/graphql/queries/news";
import { getClient, query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import PostView from "@/components/post-view";

export const revalidate = 3600;

// Prerender every published news post so Vercel serves them from the CDN.
// Paths not listed here still render on demand and are then ISR-cached.
export async function generateStaticParams() {
  try {
    const { data } = await getClient().query<{ posts: { nodes: { uri: string }[] } }>({
      query: NewsSitemapQuery,
      context: { fetchOptions: { next: { tags: ["news-sitemap"], revalidate: 3600 } } },
    });

    return (data?.posts?.nodes ?? [])
      .map((post) => (post.uri ?? "").split("/").filter(Boolean))
      // uri is /news/YYYY/MM/DD/slug — drop the leading "news" segment
      .filter((parts) => parts.length === 5 && parts[0] === "news")
      .map(([, year, month, day, slug]) => ({ year, month, day, slug }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<PageParams>;
};

type PostQueryResult = {
  post: Post;
};

type PageParams = {
  slug: string;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const { data } = await query<PostQueryResult>({
    query: PostSeoQuery,
    variables: { slug: slug },
    context: { fetchOptions: { next: { tags: [`post:${slug}`], revalidate: 3600 } } },
  });

  if (!data || !data.post || !data.post.seo) {
    return {
      title: "Not Found",
    };
  }

  const {
    post: { seo },
  } = data;

  return {
    title: seo?.title,
    ...generatePageMetadata(seo),
  };
};

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const { data } = await query<PostQueryResult>({
    query: PostQuery,
    variables: { slug: slug },
    context: { fetchOptions: { next: { tags: [`post:${slug}`], revalidate: 3600 } } },
  });

  if (!data || !data.post) {
    return notFound();
  }

  const { post } = data;

  return (
    <div className="AppContent row" role="main">
      {post?.seo?.schema?.raw && (
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: replaceDomain(post.seo.schema.raw),
          }}
        />
      )}
      <PostView post={post} backHref="/news" />
    </div>
  );
}
