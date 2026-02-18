import { Suspense } from "react";
import Script from "next/script";
import type { Metadata } from "next/types";
import { PageEditorBlock, type Page as PageType, type Person } from "@/graphql/generated/graphql";
import { PageQuery } from "@/graphql/queries/page";
import { PeopleListQuery, type PeopleListQueryResult } from "@/graphql/queries/people";
import { query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { getSiteSettings } from "@/lib/utilities/querySiteSettings";
import { replaceDomain } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import PageBuilder from "@/components/blocks/render-blocks";
import MemberCard from "@/components/member-card";

type PageQueryResult = {
  page: PageType;
};

export const generateMetadata = async (): Promise<Metadata> => {
  const siteSettings = await getSiteSettings();
  const { data } = await query<PageQueryResult>({
    query: PageQuery,
    variables: { slug: siteSettings?.themeSettings?.themeOptions?.pageForPerson?.nodes[0]?.uri },
    context: { fetchOptions: { next: { tags: ["people-page"], revalidate: 3600 } } },
  });

  if (!data || !data.page || !data.page.seo) {
    return {
      title: "Our People",
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

export default async function People() {
  const siteSettings = await getSiteSettings();
  const { data } = await query<PageQueryResult>({
    query: PageQuery,
    variables: { slug: siteSettings?.themeSettings?.themeOptions?.pageForPerson?.nodes[0]?.uri },
    context: { fetchOptions: { next: { tags: ["people-page"], revalidate: 3600 } } },
  });

  const page = data?.page;
  const blocks = page?.editorBlocks ?? [];
  const { data: peopleRes } = await query<PeopleListQueryResult>({
    query: PeopleListQuery,
    variables: {
      first: 999,
      after: null,
      orderby: [
        {
          order: "ASC",
          field: "MENU_ORDER",
        },
      ],
    },
    context: { fetchOptions: { next: { tags: ["people-list"], revalidate: 3600 } } },
  });
  return (
    <div className="page-template-people-template">
      <div role="main" className="AppContent row">
        {page?.seo?.schema?.raw && (
          <Script
            id="schema-jsonld"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: replaceDomain(page.seo.schema.raw) }}
          />
        )}
        <section className="u-wrap People">
          <div className="columns">
            {page?.content && (
              <div
                className="rte u-spaceAfterLarge"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(page.content) }}
              />
            )}
            {blocks?.length > 0 && <PageBuilder blocks={blocks as PageEditorBlock[]} />}
            {peopleRes?.people?.nodes && peopleRes.people.nodes.length > 0 && (
              <Suspense fallback={null}>
                <div className="PersonGrid">
                  {peopleRes.people.nodes.map((p, i) => (
                    <MemberCard
                      key={p.id ?? i}
                      name={(p as Person).title ?? ""}
                      position={(p as Person).personFields?.position ?? ""}
                      slug={(p as Person).slug ?? ""}
                      email={(p as Person).personFields?.email ?? ""}
                      phone={(p as Person).personFields?.phone ?? ""}
                      linkedinUrl={(p as Person).personFields?.linkedinUrl ?? ""}
                      details={(p as Person).content ?? ""}
                      image={(p as Person).featuredImage as any}
                    />
                  ))}
                </div>
              </Suspense>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
