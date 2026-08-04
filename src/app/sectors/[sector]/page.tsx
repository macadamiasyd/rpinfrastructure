import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  TaxonomyEnum,
  TaxQueryField,
  TaxQueryOperator,
  type ProjectCategory,
} from "@/graphql/generated/graphql";
import { ProjectSectorQuery, ProjectSectorsSitemapQuery } from "@/graphql/queries";
import { getClient, query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import ProjectsArchive from "@/components/projects-archive";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { data } = await getClient().query<{
      projectCategories: { nodes: { slug: string }[] };
    }>({
      query: ProjectSectorsSitemapQuery,
      context: { fetchOptions: { next: { tags: ["sectors-sitemap"], revalidate: 3600 } } },
    });

    return (data?.projectCategories?.nodes ?? [])
      .filter((sector) => !!sector.slug)
      .map((sector) => ({ sector: sector.slug }));
  } catch {
    return [];
  }
}

type SectorParams = {
  sector: string;
};

type Props = {
  params: Promise<SectorParams>;
};

type SectorQueryResult = {
  projectCategory: ProjectCategory;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { sector } = await params;
  const { data } = await query<SectorQueryResult>({
    query: ProjectSectorQuery,
    // The query declares $slug — passing `sector` left it undefined, so every
    // sector page fell through to the "Not Found" title. Visible once prerendered.
    variables: { slug: sector },
    context: { fetchOptions: { next: { tags: [`sector:${sector}`], revalidate: 3600 } } },
  });
  if (!data || !data?.projectCategory?.seo) {
    return {
      title: "Not Found",
    };
  }

  const {
    projectCategory: { seo },
  } = data;

  return {
    title: seo?.title,
    ...generatePageMetadata(seo),
  };
};

export default async function Location({ params }: Props) {
  const { sector } = await params;
  const { data } = await query<SectorQueryResult>({
    query: ProjectSectorQuery,
    variables: { slug: sector },
    context: { fetchOptions: { next: { tags: [`sector:${sector}`], revalidate: 3600 } } },
  });

  if (!data || !data.projectCategory) {
    return notFound();
  }

  const { projectCategory } = data;
  const { name, description } = projectCategory;
  return (
    <>
      {projectCategory?.seo?.schema?.raw && (
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: replaceDomain(projectCategory.seo.schema.raw),
          }}
        />
      )}
      <ProjectsArchive
        title={name}
        description={description}
        tags={["projects", `projects:sector:${sector}`]}
        taxQuery={{
          taxArray: [
            {
              taxonomy: TaxonomyEnum.Projectcategory,
              operator: TaxQueryOperator.In,
              field: TaxQueryField.Slug,
              terms: [sector],
              // A parent sector's landing page must list the projects tagged to its sub-sectors.
              includeChildren: true,
            },
          ],
        }}
      />
    </>
  );
}
