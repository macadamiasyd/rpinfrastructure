import Link from "next/link";
import type { ContentNode, MediaItem } from "@/graphql/generated/graphql";
import { SearchQuery } from "@/graphql/queries";
import { query } from "@/lib/api/client";
import { normalizeAppHref, replaceDomain } from "@/lib/utilities/replaceDomain";

import MediaImage from "@/components/shared/media/image";
import SearchInput from "@/components/search/input.client";

type Props = {
  searchParams: Promise<{ q?: string; first?: string }>;
};

type SearchNode = ContentNode & {
  __typename?: string;
  title?: string | null;
  uri?: string | null;
  slug?: string | null;
  featuredImage?: { node?: MediaItem | null } | null;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", first = "24" } = await searchParams;
  const term = q.trim();

  let nodes: SearchNode[] = [];
  if (term) {
    const { data } = await query<{ contentNodes: { nodes: SearchNode[] } }>({
      query: SearchQuery,
      variables: { term, first: Number(first) || 24 },
      context: { fetchOptions: { next: { tags: [`search:${term}`], revalidate: 300 } } },
    });
    // Drop results with no resolvable URL. The posts page ("Latest News")
    // comes back with a null uri and rendered as a dead tile.
    nodes = (data?.contentNodes?.nodes ?? []).filter((node) => {
      if (node?.__typename === "Project" || node?.__typename === "Person") {
        return !!node.slug;
      }
      return !!node?.uri;
    });
  }

  const renderItem = (node: SearchNode, index: number) => {
    const thumb = node?.featuredImage?.node ? (
      <MediaImage {...node.featuredImage.node} className="LazyLoad-image u-bounceUp" />
    ) : (
      <MediaImage
        {...({
          sourceUrl: "/img/placeholder-image.svg",
          altText: "No image",
          mediaDetails: { width: 600, height: 360 },
        } as any)}
        className="LazyLoad-image u-bounceUp"
      />
    );
    if (node.__typename === "Project" && node.slug) {
      const href = `/project/${node.slug}`;
      return (
        <Link key={`search-item-${index}`} href={href} className="ProjectGrid-thumb Tile column">
          <div className="LazyLoad">{thumb}</div>
          {node.title && (
            <h3 className="Tile-title" dangerouslySetInnerHTML={{ __html: node.title ?? "" }} />
          )}
          <span className="u-linkForward Tile-readMore">
            <span>Read more</span>
            <svg className="Icon Icon-arrow-right">
              <use xlinkHref="#icon-arrow-right" />
            </svg>
          </span>
        </Link>
      );
    }
    if (node.__typename === "Person" && node.slug) {
      const href = `/people?person=${node.slug}`;
      return (
        <Link key={`search-item-${index}`} href={href} className="ProjectGrid-thumb Tile column">
          <div className="LazyLoad">{thumb}</div>
          {node.title && (
            <h3 className="Tile-title" dangerouslySetInnerHTML={{ __html: node.title ?? "" }} />
          )}
          <span className="u-linkForward Tile-readMore">
            <span>Read more</span>
            <svg className="Icon Icon-arrow-right">
              <use xlinkHref="#icon-arrow-right" />
            </svg>
          </span>
        </Link>
      );
    }
    const { href, isInternal } = normalizeAppHref(node.uri ?? "");
    if (isInternal && href) {
      return (
        <Link key={`search-item-${index}`} href={href} className="ProjectGrid-thumb Tile column">
          <div className="LazyLoad">{thumb}</div>
          {node.title && (
            <h3 className="Tile-title" dangerouslySetInnerHTML={{ __html: node.title ?? "" }} />
          )}
          <span className="u-linkForward Tile-readMore">
            <span>Read more</span>
            <svg className="Icon Icon-arrow-right">
              <use xlinkHref="#icon-arrow-right" />
            </svg>
          </span>
        </Link>
      );
    }
    const external = replaceDomain(node.uri ?? "");
    return (
      <a
        key={`search-item-${index}`}
        href={external}
        className="ProjectGrid-thumb Tile column"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="LazyLoad">{thumb}</div>
        {node.title && (
          <h3 className="Tile-title" dangerouslySetInnerHTML={{ __html: node.title ?? "" }} />
        )}
        <span className="u-linkForward Tile-readMore">
          <span>Read more</span>
          <svg className="Icon Icon-arrow-right">
            <use xlinkHref="#icon-arrow-right" />
          </svg>
        </span>
      </a>
    );
  };

  return (
    <div role="main" className="AppContent row">
      <article className="Page Page--home u-wrap">
        <h2 className="show-for-sr">Search</h2>
        <div className="Page-body Search Search--page">
          <div className="row">
            <div className="columns large-12">
              <SearchInput placeholder="Search" />
              {!term && <p className="Search-suggestion">Type a query to search.</p>}
              {term && nodes.length === 0 && (
                <p className="Search-noResults">{`No results found for "${term}".`}</p>
              )}
            </div>
          </div>
          {nodes.length > 0 && (
            <div className="row u-spaceBeforeLarge">
              <div className="ProjectGrid row small-up-2 large-up-3 xlarge-up-4">
                {nodes.map((node, idx) => renderItem(node, idx))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
