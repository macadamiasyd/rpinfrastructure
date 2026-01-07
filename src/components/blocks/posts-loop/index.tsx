import Link from "next/link";
import type {
  AcfPostsLoop,
  ContentNode,
  MediaItem,
  PostObjectsConnectionOrderbyInput,
} from "@/graphql/generated/graphql";
import {
  PostsLoopPostsQuery,
  PostsLoopProjectsByCategoryQuery,
  PostsLoopProjectsByLocationQuery,
  PostsLoopProjectsByServiceQuery,
  PostsLoopProjectsRootQuery,
} from "@/graphql/queries/posts-loop";
import { getClient } from "@/lib/api/client";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import MediaImage from "@/components/shared/media/image";

type TileNode = ContentNode & {
  title?: string | null;
  uri?: string | null;
  link?: string | null;
  featuredImage?: { node?: MediaItem | null } | null;
};

type BlockSettings = {
  title?: string | null;
  postsPerPage?: number | null;
  offset?: number | null;
  order?: (string | null)[] | null;
  orderby?: (string | null)[] | null;
  postType?: (string | null)[] | null;
  categories?: { nodes?: Array<{ databaseId?: number | null } | null> | null } | null;
  projectCategories?: { nodes?: Array<{ databaseId?: number | null } | null> | null } | null;
  projectLocations?: { nodes?: Array<{ databaseId?: number | null } | null> | null } | null;
  projectServices?: { nodes?: Array<{ databaseId?: number | null } | null> | null } | null;
};

function toOrderInputs(
  order?: (string | null)[] | null,
  orderby?: (string | null)[] | null
): PostObjectsConnectionOrderbyInput[] {
  const orderValue = (order?.[0] || "DESC").toUpperCase();
  const fields = (orderby && orderby.length > 0 ? orderby : ["DATE"]) as (string | null)[];
  return fields.filter(Boolean).map((field) => ({
    field: String(field).toUpperCase(),
    order: orderValue,
  })) as unknown as PostObjectsConnectionOrderbyInput[];
}

export default async function PostsLoopBlock(block: AcfPostsLoop) {
  const className = block.attributes?.className ?? "";
  const settings = (block.bloc ?? {}) as BlockSettings;
  const first = Math.max(1, Math.trunc(settings?.postsPerPage ?? 6));
  const orderInputs = toOrderInputs(settings?.order, settings?.orderby);
  const postType = (settings?.postType?.[0] || "post").toLowerCase();

  const client = getClient();
  let nodes: TileNode[] = [];

  if (postType === "post") {
    const categoryIn = (settings?.categories?.nodes || [])
      .map((n) => n?.databaseId)
      .filter((id): id is number => typeof id === "number");

    const { data } = await client.query<
      { posts?: { nodes?: TileNode[] } },
      {
        first: number;
        categoryIn?: (number | string)[];
        orderby?: PostObjectsConnectionOrderbyInput[];
      }
    >({
      query: PostsLoopPostsQuery,
      variables: { first, categoryIn, orderby: orderInputs },
    });
    nodes = (data?.posts?.nodes || []) as TileNode[];
  } else if (postType === "project") {
    const categoryId = (settings?.projectCategories?.nodes || [])
      .map((n) => n?.databaseId)
      .find((id): id is number => typeof id === "number");
    const locationId = (settings?.projectLocations?.nodes || [])
      .map((n) => n?.databaseId)
      .find((id): id is number => typeof id === "number");
    const serviceId = (settings?.projectServices?.nodes || [])
      .map((n) => n?.databaseId)
      .find((id): id is number => typeof id === "number");

    if (typeof categoryId === "number") {
      const { data } = await client.query<
        { projectCategory?: { projects?: { nodes?: TileNode[] } } },
        { termId: number; first: number; orderby?: PostObjectsConnectionOrderbyInput[] }
      >({
        query: PostsLoopProjectsByCategoryQuery,
        variables: { termId: categoryId, first, orderby: orderInputs },
      });
      nodes = (data?.projectCategory?.projects?.nodes || []) as TileNode[];
    } else if (typeof locationId === "number") {
      const { data } = await client.query<
        { projectLocation?: { projects?: { nodes?: TileNode[] } } },
        { termId: number; first: number; orderby?: PostObjectsConnectionOrderbyInput[] }
      >({
        query: PostsLoopProjectsByLocationQuery,
        variables: { termId: locationId, first, orderby: orderInputs },
      });
      nodes = (data?.projectLocation?.projects?.nodes || []) as TileNode[];
    } else if (typeof serviceId === "number") {
      const { data } = await client.query<
        { projectService?: { projects?: { nodes?: TileNode[] } } },
        { termId: number; first: number; orderby?: PostObjectsConnectionOrderbyInput[] }
      >({
        query: PostsLoopProjectsByServiceQuery,
        variables: { termId: serviceId, first, orderby: orderInputs },
      });
      nodes = (data?.projectService?.projects?.nodes || []) as TileNode[];
    } else {
      const { data } = await client.query<
        { projects?: { nodes?: TileNode[] } },
        { first: number; orderby?: PostObjectsConnectionOrderbyInput[] }
      >({
        query: PostsLoopProjectsRootQuery,
        variables: { first, orderby: orderInputs },
      });
      nodes = (data?.projects?.nodes || []) as TileNode[];
    }
  }

  if (!nodes || nodes.length === 0) return null;

  const renderTile = (node: TileNode, index: number) => {
    const { title, uri, link, featuredImage } = node;
    const href = replaceDomain(uri ?? link ?? "");

    return (
      <Link key={`postsLoop-tile-${index}`} href={href} className="HomeFeed-tile">
        {featuredImage?.node && (
          <div className="LazyLoad">
            <MediaImage {...featuredImage.node} />
          </div>
        )}
        {title && <h3 className="Tile-title" dangerouslySetInnerHTML={{ __html: title ?? "" }} />}
        <p>
          <span className="u-forwardLink">Read more</span>
        </p>
      </Link>
    );
  };

  return (
    <section className={`HomeFeed u-insetWrap ${className}`}>
      {settings?.title && (
        <h2 className="StorySection-header" dangerouslySetInnerHTML={{ __html: settings.title }} />
      )}
      <div className="HomeFeed-row">{nodes.map((node, idx) => renderTile(node, idx))}</div>
    </section>
  );
}
