import Link from "next/link";
import type { Post } from "@/graphql/generated/graphql";
import { formatPostDate } from "@/lib/utilities/formatPostDate";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import MediaImage from "@/components/shared/media/image";

export default function PostCard({ uri, title, featuredImage, excerpt, dateGmt }: Post) {
  const { datetime, display } = formatPostDate(dateGmt ?? "");
  return (
    <Link href={uri ?? ""} className="PostThumbnail PostThumbnail--horizontal js-postThumbnail">
      {featuredImage?.node && (
        <div className="PostThumbnail-sidebar">
          <div className="LazyLoad PostThumbnail-thumbnail">
            <MediaImage {...featuredImage.node} />
          </div>
        </div>
      )}

      <div className="PostThumbnail-main">
        <time className="PostThumbnail-postDate" dateTime={datetime}>
          {display}
        </time>
        <h2 className="PostThumbnail-title">{title}</h2>
        {excerpt && (
          <div
            className="PostThumbnail-excerpt"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(excerpt) }}
          />
        )}
      </div>
    </Link>
  );
}
