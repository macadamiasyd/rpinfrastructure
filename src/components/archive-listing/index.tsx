"use client";

import { MouseEvent, useEffect, useState } from "react";
import type { Post, RootQueryToPostConnection } from "@/graphql/generated/graphql";
import { queryPosts } from "@/lib/utilities/queryPosts";
import clsx from "clsx";

import type { PostsQueryType } from "@/types/posts";
import FeaturedPost from "../cards/featured-post";
import PostCard from "../cards/post-card";

type Props = {
  params:
    | {
        posts: RootQueryToPostConnection;
      }
    | undefined;
  queryParams?: PostsQueryType;
  header?: React.ReactNode;
  loading?: boolean;
};
export default function ArchiveListing({
  params,
  queryParams,
  header,
  loading: loadingProp,
}: Props) {
  const [hasNext, setHasNext] = useState<boolean>(params?.posts?.pageInfo?.hasNextPage ?? false);
  const [cursor, setCursor] = useState<string>(params?.posts?.pageInfo?.endCursor ?? "");
  const [posts, setPosts] = useState<Post[]>(params?.posts?.nodes ?? []);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const isOverlayLoading = !!loadingProp;

  const loadMore = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      setButtonLoading(true);

      const data = await queryPosts({
        params: {
          ...queryParams,
          after: cursor,
        },
      });
      if (data) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts?.nodes]);
        setHasNext(data.posts?.pageInfo?.hasNextPage);
        setCursor(data.posts?.pageInfo?.endCursor ?? "");
      }
    } catch (error) {
      console.error(`Something went wrong during load more: ${error}`, error);
    } finally {
      setButtonLoading(false);
    }
  };
  useEffect(() => {
    setPosts(params?.posts?.nodes ?? []);
    setHasNext(!!params?.posts?.pageInfo?.hasNextPage);
    setCursor(params?.posts?.pageInfo?.endCursor ?? "");
  }, [params]);

  const featurePosts = posts.slice(0, 6);
  const morePosts = posts.slice(6);
  return (
    <div
      className={clsx("columns large-8 end u-spaceAfterHuge", {
        loading: isOverlayLoading,
      })}
    >
      {header}
      {isOverlayLoading ? (
        <div
          className="ProjectsListing-loading"
          role="status"
          aria-live="polite"
          aria-busy="true"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            marginBlock: 60,
          }}
        >
          <svg
            className="Spinner"
            width="50"
            height="50"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="60"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <span className="show-for-sr">Loading</span>
        </div>
      ) : posts.length > 0 ? (
        <div>
          {featurePosts?.map((post, index) => (
            <FeaturedPost key={post.databaseId ?? index} {...post} />
          ))}

          {morePosts?.length > 0 && (
            <section className="PostsList u-spaceBeforeHuge js-postsList">
              <h3 className="PostsList-title">More news</h3>
              {morePosts?.map((post, index) => (
                <PostCard key={post.databaseId ?? index} {...post} />
              ))}
            </section>
          )}
          {hasNext && (
            <div className="PostsList-footer u-spaceBeforeLarge">
              <button
                type="button"
                className="PostsList-loadMore js-postsNextBtn button"
                onClick={loadMore}
                disabled={buttonLoading}
                aria-busy={buttonLoading}
              >
                {buttonLoading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <h2>Sorry, posts not found.</h2>
      )}
    </div>
  );
}
