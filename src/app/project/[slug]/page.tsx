import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next/types";
import {
  TaxonomyEnum,
  TaxQueryField,
  TaxQueryOperator,
  type Project,
  type ProjectCategory,
} from "@/graphql/generated/graphql";
import { ProjectQuery, ProjectSeoQuery, ProjectsSitemapQuery } from "@/graphql/queries/projects";
import { getClient, query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { queryProjects } from "@/lib/utilities/queryProjects";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import RelatedProjectCard from "@/components/cards/related-project-card.client";
import ProjectView from "@/components/project-view";

export const revalidate = 3600;

// Prerender every published project so Vercel serves them from the CDN.
// Paths not listed here still render on demand and are then ISR-cached.
export async function generateStaticParams() {
  try {
    const { data } = await getClient().query<{ projects: { nodes: { slug: string }[] } }>({
      query: ProjectsSitemapQuery,
      context: { fetchOptions: { next: { tags: ["projects-sitemap"], revalidate: 3600 } } },
    });

    return (data?.projects?.nodes ?? [])
      .filter((project) => !!project.slug)
      .map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

type ProjectQueryResult = {
  project?: Project;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const { data } = await query<ProjectQueryResult>({
    query: ProjectSeoQuery,
    variables: { slug },
    context: { fetchOptions: { next: { tags: [`project:${slug}`], revalidate: 3600 } } },
  });

  const seo = data?.project?.seo;
  if (!seo) {
    return { title: "Not Found" };
  }
  return {
    title: seo?.title,
    ...generatePageMetadata(seo as any),
  };
};

export default async function Project({ params }: Props) {
  const { slug } = await params;
  const { data } = await query<ProjectQueryResult>({
    query: ProjectQuery,
    variables: { slug },
    context: { fetchOptions: { next: { tags: [`project:${slug}`], revalidate: 3600 } } },
  });

  const project = data?.project;
  if (!project) return notFound();

  const categories = (project.projectCategories?.nodes ?? []).filter(Boolean);

  const backCategorySlug = categories[0] ? (categories[0] as ProjectCategory).slug : "";
  const backCategoryLink = (categories[0] as ProjectCategory)?.uri ?? "";

  // Default destination for "Back to projects". When the visitor arrived with
  // portfolio filters active, BackToProjectsLink swaps this for the filtered
  // URL on the client — keeping this page static and CDN-cacheable.
  const backHref = backCategorySlug
    ? `/portfolio?category=${backCategorySlug}`
    : backCategoryLink || `/portfolio`;

  let related;

  if (backCategorySlug) {
    const data = await queryProjects({
      notIn: project.databaseId,
      first: 5,
      tags: ["related-projects", `related-projects:${backCategorySlug}`],
      taxQuery: {
        taxArray: [
          {
            taxonomy: TaxonomyEnum.Projectcategory,
            operator: TaxQueryOperator.In,
            field: TaxQueryField.Slug,
            terms: [backCategorySlug],
          },
        ],
      },
    });

    related = data;
  }

  const relatedNodes = related?.projects?.nodes ?? [];

  return (
    <div className="AppContent row" role="main">
      {project?.seo?.schema?.raw && (
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: replaceDomain(project.seo.schema.raw ?? "") }}
        />
      )}

      <ProjectView project={project} backHref={backHref} />
      {relatedNodes.length > 0 && (
        <aside className="u-wrap">
          <div className="RelatedProjects">
            <hr className="RelatedProjects-rule" />
            <h3 className="RelatedProjects-title">Related Projects</h3>
            <hr className="RelatedProjects-rule" />
            <div className="RelatedProjects-list">
              {(relatedNodes ?? []).map((p, idx) => (
                <RelatedProjectCard key={p.id ?? idx} {...(p as any)} />
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
