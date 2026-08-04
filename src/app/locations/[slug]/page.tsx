import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  TaxonomyEnum,
  TaxQueryField,
  TaxQueryOperator,
  type ProjectLocation,
} from "@/graphql/generated/graphql";
import { ProjectLocationQuery, ProjectLocationsSitemapQuery } from "@/graphql/queries";
import { getClient, query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import ProjectsArchive from "@/components/projects-archive";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { data } = await getClient().query<{
      projectLocations: { nodes: { slug: string }[] };
    }>({
      query: ProjectLocationsSitemapQuery,
      context: { fetchOptions: { next: { tags: ["locations-sitemap"], revalidate: 3600 } } },
    });

    return (data?.projectLocations?.nodes ?? [])
      .filter((location) => !!location.slug)
      .map((location) => ({ slug: location.slug }));
  } catch {
    return [];
  }
}

type PageParams = {
  slug: string;
};

type Props = {
  params: Promise<PageParams>;
};

type LocationQueryResult = {
  projectLocation: ProjectLocation;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const { data } = await query<LocationQueryResult>({
    query: ProjectLocationQuery,
    variables: { slug },
    context: { fetchOptions: { next: { tags: [`location:${slug}`], revalidate: 3600 } } },
  });
  if (!data || !data?.projectLocation?.seo) {
    return {
      title: "Not Found",
    };
  }

  const {
    projectLocation: { seo },
  } = data;

  return {
    title: seo?.title,
    ...generatePageMetadata(seo),
  };
};

export default async function Location({ params }: Props) {
  const { slug } = await params;
  const { data } = await query<LocationQueryResult>({
    query: ProjectLocationQuery,
    variables: { slug },
    context: { fetchOptions: { next: { tags: [`location:${slug}`], revalidate: 3600 } } },
  });

  if (!data || !data.projectLocation) {
    return notFound();
  }

  const { projectLocation } = data;
  const { name, description } = projectLocation;
  return (
    <>
      {projectLocation?.seo?.schema?.raw && (
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: replaceDomain(projectLocation.seo.schema.raw),
          }}
        />
      )}
      <ProjectsArchive
        title={name}
        description={description}
        tags={["projects", `projects:location:${slug}`]}
        taxQuery={{
          taxArray: [
            {
              taxonomy: TaxonomyEnum.Projectlocation,
              operator: TaxQueryOperator.In,
              field: TaxQueryField.Slug,
              terms: [slug],
              // Locations nest too — the states sit under Australia, which holds
              // no projects directly. Without this its page lists nothing.
              includeChildren: true,
            },
          ],
        }}
      />
    </>
  );
}
