"use server";

import type { RootQueryToPostConnection } from "@/graphql/generated/graphql";
import { PostsQuery } from "@/graphql/queries/news";
import { query } from "@/lib/api/client";
import type { ApolloClient } from "@apollo/client";

import type { PostsQueryType } from "@/types/posts";

type Params = {
  params?: PostsQueryType;
  tags?: string[];
};

export const queryPosts = async (
  params: Params
): Promise<
  | {
      posts: RootQueryToPostConnection;
    }
  | undefined
> => {
  const { tags, params: queryParams } = params;
  const requestData: ApolloClient.QueryOptions = {
    query: PostsQuery,
    variables: queryParams,
    context: { fetchOptions: { next: { cache: "no-cache", revalidate: false } } },
  };

  if (tags && tags.length > 0) {
    requestData.context = {
      fetchOptions: {
        next: {
          tags: tags,
          cache: "force-cache",
          revalidate: 3600,
        },
      },
    };
  }
  const { data } = await query<{
    posts: RootQueryToPostConnection;
  }>(requestData);

  return data;
};
