import type { ContentNode } from "@/graphql/generated/graphql";
import { PreviewQuery } from "@/graphql/queries";

import { query } from "../api/client";

export const getPreviewData = async (post_id: number): Promise<ContentNode | null> => {
  try {
    const { data } = await query<{ contentNode: ContentNode }>({
      query: PreviewQuery,
      variables: { id: post_id },
      context: { fetchOptions: { next: { tags: [`node:${post_id}`], revalidate: 3600 } } },
    });

    if (!data) {
      return null;
    }

    return data.contentNode ?? null;
  } catch (error) {
    console.error(`Error fetching preview data for post_id ${post_id}: ${error}`);
    return null;
  }
};
