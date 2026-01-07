import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  TaxonomyEnum,
  TaxQueryField,
  TaxQueryOperator,
  type ProjectService,
} from "@/graphql/generated/graphql";
import { ProjectServiceQuery } from "@/graphql/queries";
import { query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import ProjectsArchive from "@/components/projects-archive";

type ServiceParams = {
  slug: string;
};

type Props = {
  params: Promise<ServiceParams>;
};

type ServiceQueryResult = {
  projectService: ProjectService;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const { data } = await query<ServiceQueryResult>({
    query: ProjectServiceQuery,
    variables: { slug },
    context: { fetchOptions: { next: { tags: [`service:${slug}`], revalidate: 3600 } } },
  });
  if (!data || !data?.projectService?.seo) {
    return {
      title: "Not Found",
    };
  }

  const {
    projectService: { seo },
  } = data;

  return {
    title: seo?.title,
    ...generatePageMetadata(seo),
  };
};

export default async function Location({ params }: Props) {
  const { slug } = await params;
  const { data } = await query<ServiceQueryResult>({
    query: ProjectServiceQuery,
    variables: { slug },
    context: { fetchOptions: { next: { tags: [`servcie:${slug}`], revalidate: 3600 } } },
  });

  if (!data || !data.projectService) {
    return notFound();
  }

  const { projectService } = data;
  const { name, description } = projectService;
  return (
    <>
      {projectService?.seo?.schema?.raw && (
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: replaceDomain(projectService.seo.schema.raw),
          }}
        />
      )}
      <ProjectsArchive
        title={name}
        description={description}
        tags={["projects", `projects:service:${slug}`]}
        taxQuery={{
          taxArray: [
            {
              taxonomy: TaxonomyEnum.Projectservice,
              operator: TaxQueryOperator.In,
              field: TaxQueryField.Slug,
              terms: [slug],
            },
          ],
        }}
      />
    </>
  );
}
