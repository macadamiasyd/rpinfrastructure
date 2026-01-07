"use server";

import type { RootQueryToProjectConnection, TaxQuery } from "@/graphql/generated/graphql";
import { ProjectsArchiveQuery } from "@/graphql/queries/projects";
import { query } from "@/lib/api/client";
import type { ApolloClient } from "@apollo/client";

type Params = {
  after?: string;
  first?: number;
  taxQuery?: NonNullable<TaxQuery>;
  tags?: string[];
  notIn?: number;
};

export const queryProjects = async (
  params: Params
): Promise<
  | {
      projects: RootQueryToProjectConnection;
    }
  | undefined
> => {
  const { tags, after, taxQuery, notIn, first = 12 } = params;
  const requestOptions: ApolloClient.QueryOptions = {
    query: ProjectsArchiveQuery,
    variables: {
      first,
      after,
      taxQuery,
      notIn,
    },
    context: { fetchOptions: { next: { cache: "force-cache", revalidate: 3600, tags } } },
  };

  const { data } = await query<{
    projects: RootQueryToProjectConnection;
  }>(requestOptions);
  return data;
};
