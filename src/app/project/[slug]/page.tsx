import { headers } from "next/headers";
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
import { ProjectQuery, ProjectSeoQuery } from "@/graphql/queries/projects";
import { query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { queryProjects } from "@/lib/utilities/queryProjects";
import { replaceDomain } from "@/lib/utilities/replaceDomain";

import ProjectCard from "@/components/cards/project-card";
import ProjectView from "@/components/project-view";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
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

export default async function Project({ params, searchParams }: Props) {
  const { slug } = await params;
  const sparams = (await searchParams) ?? {};
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
  let backHref = backCategorySlug
    ? `/portfolio?category=${backCategorySlug}`
    : backCategoryLink || `/portfolio`;

  const hdrs = await headers();
  const referer = hdrs.get("referer");
  const searchFromCurrent = (() => {
    const sp = new URLSearchParams();
    const cat = sparams.category;
    const srv = sparams.service;
    const loc = sparams.location;
    if (cat) sp.set("category", cat);
    if (srv) sp.set("service", srv);
    if (loc) sp.set("location", loc);
    return sp.toString();
  })();
  let hrefQuery = searchFromCurrent;
  if (searchFromCurrent) {
    backHref = `/portfolio?${searchFromCurrent}`;
  }
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.pathname.startsWith("/portfolio")) {
        backHref = `/portfolio${url.search || ""}`;
        if (!hrefQuery) hrefQuery = url.search.replace(/^\?/, "");
      } else if (url.pathname.startsWith("/project")) {
        if (!searchFromCurrent) {
          backHref = `/portfolio`;
          hrefQuery = "";
        }
      }
    } catch {
      // ignore invalid referrer
    }
  }
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
                <ProjectCard key={p.id ?? idx} {...(p as any)} hrefQuery={hrefQuery} />
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
