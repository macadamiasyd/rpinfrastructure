import Link from "next/link";
import type { Project } from "@/graphql/generated/graphql";

import MediaImage from "@/components/shared/media/image";

export default function ProjectCard({
  title,
  featuredImage,
  slug,
  uri,
  link,
  subtitle,
  hrefQuery,
}: Project & { subtitle?: string; hrefQuery?: string }) {
  const image = featuredImage?.node;
  const href = slug ? `/project/${slug}${hrefQuery ? `?${hrefQuery}` : ""}` : (uri ?? link ?? "#");
  return (
    <Link href={href} className="ProjectGrid-thumb Tile column">
      <div className="LazyLoad">
        {image && <MediaImage {...image} className="LazyLoad-image u-bounceUp" />}
      </div>
      {title && <h4 className="Tile-title" dangerouslySetInnerHTML={{ __html: title }} />}
      {subtitle && <p className="Tile-subTitle" dangerouslySetInnerHTML={{ __html: subtitle }} />}
    </Link>
  );
}
