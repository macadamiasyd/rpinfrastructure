import type { Metadata } from "next";
import type { Page, ReadingSettings } from "@/graphql/generated/graphql";
import { BlogArchivePageSeoQuery } from "@/graphql/queries/news";
import { ReadingSettingsQuery } from "@/graphql/queries/reading-settings";
import { query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";

import NewsArchive from "@/components/news-archive";

type ReadingSettingsQueryResult = {
  readingSettings: ReadingSettings;
};

type BlogArchivePageSeoQueryResult = {
  page: Page;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const { data: readingSettings } = await query<ReadingSettingsQueryResult>({
    query: ReadingSettingsQuery,
  });

  if (!readingSettings || !readingSettings.readingSettings.pageForPosts) {
    return {
      title: "Latest News",
    };
  }

  const { data: blogArchivePage } = await query<BlogArchivePageSeoQueryResult>({
    query: BlogArchivePageSeoQuery,
    variables: { id: readingSettings.readingSettings.pageForPosts },
  });

  if (!blogArchivePage || !blogArchivePage.page || !blogArchivePage.page.seo) {
    return {
      title: "Latest News",
    };
  }
  const { seo } = blogArchivePage.page;

  return {
    title: seo.title ?? "Latest News",
    ...generatePageMetadata(seo),
  };
};
export default function News() {
  return <NewsArchive />;
}
