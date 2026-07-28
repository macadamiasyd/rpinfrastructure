import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next/types";
import type { PageEditorBlock, Page as PageType } from "@/graphql/generated/graphql";
import { PagesSitemapQuery, PageQuery, PageSeoQuery } from "@/graphql/queries";
import { getClient, query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { replaceDomain } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import PageBuilder from "@/components/blocks/render-blocks";
import PageClassNames from "@/components/page/page-classnames.client";

export const revalidate = 3600;

// Prerender every published page so Vercel serves them from the CDN.
// Paths not listed here still render on demand and are then ISR-cached.
export async function generateStaticParams() {
  try {
    const { data } = await getClient().query<{ pages: { nodes: { uri: string }[] } }>({
      query: PagesSitemapQuery,
      context: { fetchOptions: { next: { tags: ["pages-sitemap"], revalidate: 3600 } } },
    });

    return (data?.pages?.nodes ?? [])
      .map((page) => (page.uri ?? "").split("/").filter(Boolean))
      .filter((slug) => slug.length > 0)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<PageParams>;
};

type PageQueryResult = {
  page: PageType;
};

type PageParams = {
  slug: string[];
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug = ["home"] } = await params;
  const { data } = await query<PageQueryResult>({
    query: PageSeoQuery,
    variables: { slug: slug.join("/") },
    context: { fetchOptions: { next: { tags: [`page:${slug.join("/")}`], revalidate: 3600 } } },
  });

  if (!data || !data.page || !data.page.seo) {
    return {
      title: "Not Found",
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

export default async function Page({ params }: Props) {
  const { slug = ["home"] } = await params;
  const { data } = await query<PageQueryResult>({
    query: PageQuery,
    variables: { slug: slug.join("/") },
    context: { fetchOptions: { next: { tags: [`page:${slug.join("/")}`], revalidate: 3600 } } },
  });

  if (!data || !data.page) {
    return notFound();
  }

  const { page } = data;

  if (page.isPostsPage) {
    redirect("/blog");
  }

  if (page.isFrontPage && slug[0] !== "home") {
    redirect("/");
  }

  const contentHtml = sanitizeHTML(page.content ?? "");

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
      <PageClassNames
        slugParts={slug}
        templateName={page.template?.templateName ?? null}
        isFrontPage={page.isFrontPage}
      />
      <div role="main" className={`AppContent ${page?.isFrontPage ? "row" : ""}`}>
        {!!contentHtml && (
          <div className="row">
            <div className="columns">
              <div
                dangerouslySetInnerHTML={{
                  __html: contentHtml,
                }}
              />
            </div>
          </div>
        )}
        {page.editorBlocks && page.editorBlocks.length > 0 && (
          <PageBuilder blocks={page.editorBlocks as PageEditorBlock[]} />
        )}
      </div>
    </>
  );
}
