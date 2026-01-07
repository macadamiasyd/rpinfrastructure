import Link from "next/link";
import type { AcfHomeFeed, Post, Project } from "@/graphql/generated/graphql";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import MediaImage from "@/components/shared/media/image";

type TileNode =
  | Post
  | (Project & {
      categories?: { nodes?: { name?: string | null }[] | null } | null;
    });

export default function HomeFeedBlock({ homeFeed }: AcfHomeFeed) {
  if (!homeFeed) return null;
  const nodes = homeFeed?.items?.nodes as TileNode[] | undefined;
  if (!nodes || nodes.length === 0) return null;

  const renderTile = (node: TileNode, index: number) => {
    const { title, uri, categories, link, featuredImage } = node;
    const href = replaceDomain(uri ?? link ?? "");
    const category = categories?.nodes?.[0]?.name ?? "";

    return (
      <Link key={`homeFeed-tile-${index}`} href={href} className="HomeFeed-tile">
        {!!featuredImage?.node && (
          <div className="LazyLoad">
            <MediaImage {...featuredImage.node} />
          </div>
        )}
        {title && <h3 className="Tile-title" dangerouslySetInnerHTML={{ __html: title ?? "" }} />}
        {category ? (
          <span className="Tile-subTitle">{category}</span>
        ) : (
          <span className="u-linkForward Tile-readMore">
            <span>Read more</span>
            <svg className="Icon Icon-arrow-right">
              <use xlinkHref="#icon-arrow-right" />
            </svg>
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="Home u-insetWrap">
      <section className="HomeFeed">
        <h2 className="HomeFeed-title">Latest News</h2>
        <div className="HomeFeed-row">{nodes.map((node, idx) => renderTile(node, idx))}</div>
      </section>
    </div>
  );
}
