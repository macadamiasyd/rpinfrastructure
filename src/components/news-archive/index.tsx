import { Suspense } from "react";
import { NewsYearsQuery, PostCategoriesQuery } from "@/graphql/queries/news";
import { query } from "@/lib/api/client";
import { queryPosts } from "@/lib/utilities/queryPosts";

import type { PostsQueryType } from "@/types/posts";
import ArchiveNavigation from "../archive-navigation";
import PostsFilterArchive from "../posts-filter-archive";

type NewsYearsQueryResult = {
  postYears: number[];
};
type PostCategoriesQueryResult = {
  categories: {
    nodes: {
      databaseId: number;
      name?: string | null;
      slug?: string | null;
      children?: {
        nodes?: {
          databaseId: number;
          name?: string | null;
          slug?: string | null;
        }[];
      } | null;
    }[];
  };
};

type Props = {
  year?: number;
  params?: PostsQueryType;
};

export default async function NewsArchive({ year, params }: Props) {
  const { data } = await query<NewsYearsQueryResult>({
    query: NewsYearsQuery,
    context: { fetchOptions: { next: { tags: ["post-years"], revalidate: 3600 } } },
  });

  const newsAsideLinks = [
    {
      label: "All",
      uri: "/news",
    },
  ];

  if (data?.postYears) {
    newsAsideLinks.push(
      ...data.postYears.map((year) => ({
        label: String(year),
        uri: `/news/${year}`,
      }))
    );
  }

  const posts = await queryPosts({
    params,
    tags: year ? undefined : ["news"],
  });

  const { data: cats } = await query<PostCategoriesQueryResult>({
    query: PostCategoriesQuery,
    context: { fetchOptions: { next: { tags: ["post-categories"], revalidate: 3600 } } },
  });

  return (
    <div className="AppContent row blog" role="main">
      <div className="u-wrap">
        <div className="u-spaceAfterHuge">
          <div className="Posts-pullQuote">
            <p>Latest news</p>
          </div>
        </div>
        <div className="row">
          <Suspense>
            <ArchiveNavigation
              items={newsAsideLinks}
              activeYear={year}
              title="News"
              categories={cats?.categories?.nodes as any}
            />
          </Suspense>
          <Suspense>
            <PostsFilterArchive
              categories={cats?.categories?.nodes as any}
              query={posts}
              queryParams={params}
              showHeader={false}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
