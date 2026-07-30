import { Suspense } from "react";
import Script from "next/script";
import type { Metadata } from "next/types";
import { PageEditorBlock, type Page as PageType } from "@/graphql/generated/graphql";
import { PageQuery } from "@/graphql/queries/page";
import { query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { getSiteSettings } from "@/lib/utilities/querySiteSettings";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import PageBuilder from "@/components/blocks/render-blocks";

type PageQueryResult = {
  page: PageType;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const siteSettings = await getSiteSettings();
  const { data } = await query<PageQueryResult>({
    query: PageQuery,
    variables: { slug: siteSettings?.themeSettings?.themeOptions?.pageForPortfolio?.nodes[0]?.uri },
    context: { fetchOptions: { next: { tags: ["portfolio-page"], revalidate: 3600 } } },
  });

  if (!data || !data.page || !data.page.seo) {
    return {
      title: "Our Projects",
    };
  }

  const {
    page: { seo },
  } = data;

  return {
    title: seo?.title,
    ...generatePageMetadata(seo),
  };
};

export default async function Projects() {
  const siteSettings = await getSiteSettings();
  const { data } = await query<PageQueryResult>({
    query: PageQuery,
    variables: { slug: siteSettings?.themeSettings?.themeOptions?.pageForPortfolio?.nodes[0]?.uri },
    context: { fetchOptions: { next: { tags: ["portfolio-page"], revalidate: 3600 } } },
  });

  const page = data?.page;
  const blocks = page?.editorBlocks ?? [];
  const content = page?.content ?? null;

  return (
    <>
      {page?.seo?.schema?.raw && (
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: replaceDomain(page.seo.schema.raw),
          }}
        />
      )}
      {blocks?.length > 0 && (
        <Suspense fallback={null}>
          <PageBuilder blocks={blocks as PageEditorBlock[]} />
        </Suspense>
      )}
      {content && (
        <section className="row u-spaceBeforeHuge u-spaceAfterHuge">
          <div
            className="rte Portfolio-content"
            dangerouslySetInnerHTML={{ __html: replaceDomain(content) }}
          />
        </section>
      )}
    </>
  );
}
