import Link from "next/link";
import type { Post } from "@/graphql/generated/graphql";
import { formatPostDate } from "@/lib/utilities/formatPostDate";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "@/components/shared/media/image";

export default function FeaturedPost({ title, featuredImage, uri, excerpt, dateGmt }: Post) {
  const { datetime, display } = formatPostDate(dateGmt ?? "");
  return (
    <article className="PostThumbnail PostThumbnail--feature">
      {featuredImage?.node && (
        <div className="PostThumbnail-thumbnail">
          <MediaImage {...featuredImage.node} />
        </div>
      )}
      {dateGmt && (
        <div className="PostThumbnail-sidebar">
          <time className="PostThumbnail-postDate" dateTime={datetime}>
            {display}
          </time>
        </div>
      )}
      <div className="PostThumbnail-main">
        {title && (
          <h2 className="PostThumbnail-title">
            <Link href={uri ?? ""}>{title}</Link>
          </h2>
        )}
        {excerpt && (
          <div
            className="PostThumbnail-excerpt"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(excerpt) }}
          />
        )}
        <Link className="u-linkForward PostThumbnail-readMore" href={uri ?? ""}>
          <span>Read more</span>
          <svg className="Icon Icon-arrow-right">
            <use xlinkHref="#icon-arrow-right" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
