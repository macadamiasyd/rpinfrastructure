import Link from "next/link";
import type { Post } from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import PostCarousel from "@/components/post-carousel";

type Props = {
  post: Post;
  backHref?: string;
};

export default function PostView({ post, backHref = "/news" }: Props) {
  const split_content = post.content ? post.content.split("<!--more-->") : [];
  return (
    <>
      <div className="columns large-3">
        <Link href={backHref} className="u-linkBack Projects-backLink">
          <svg className="Icon Icon-arrow-left">
            <use xlinkHref="#icon-arrow-left" />
          </svg>
          Back to news
        </Link>
        <h2 className="Post-title">{post.title ?? ""}</h2>
      </div>
      <article className="columns large-8 end Post">
        <PostCarousel carousel={post.carousel as any} featuredImage={post.featuredImage as any} />
        {post.content && (
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
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content ?? "") }}
              />
            )}
          </div>
        )}
      </article>
    </>
  );
}
