import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next/types";
import type { Post } from "@/graphql/generated/graphql";
import { PostQuery, PostSeoQuery } from "@/graphql/queries/news";
import { query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { replaceDomain } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import PostCarousel from "@/components/post-carousel";

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

  const { content, carousel, featuredImage } = post;

  const split_content = content ? content.split("<!--more-->") : [];

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
      <div className="columns large-3">
        <Link href="/news" className="u-linkBack Projects-backLink">
          <svg className="Icon Icon-arrow-left">
            <use xlinkHref="#icon-arrow-left" />
          </svg>
          Back to news
        </Link>
        <h2 className="Post-title">{post.title}</h2>
      </div>
      <article className="columns large-8 end Post">
        <PostCarousel carousel={carousel} featuredImage={featuredImage} />
        {content && (
          <div className="row rte">
            {split_content.length > 1 ? (
              <>
                <div
                  className="Post-standfirst"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(split_content[0]) }}
                />
                <div
                  className="Post-main"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(split_content[1]) }}
                />
              </>
            ) : (
              <div
                className="Post-main has-no-standfirst"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
              />
            )}
          </div>
        )}
      </article>
    </div>
  );
}
