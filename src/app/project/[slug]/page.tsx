import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next/types";
import {
  TaxonomyEnum,
  TaxQueryField,
  TaxQueryOperator,
  type Project,
  type ProjectCategory,
  type ProjectLocation,
  type ProjectService,
} from "@/graphql/generated/graphql";
import { ProjectQuery, ProjectSeoQuery } from "@/graphql/queries/projects";
import { query } from "@/lib/api/client";
import { generatePageMetadata } from "@/lib/utilities/generatePageMetadata";
import { queryProjects } from "@/lib/utilities/queryProjects";
import { replaceDomain } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import ProjectCard from "@/components/cards/project-card";
import PostCarousel from "@/components/post-carousel";

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

  const subtitle = "";
  const client = "";
  const value = "";
  const completion = "";
  const categories = (project.projectCategories?.nodes ?? []).filter(Boolean);
  const services = (project.projectServices?.nodes ?? []).filter(Boolean);
  const locations = (project.projectLocations?.nodes ?? []).filter(Boolean);
  const enableLocations = locations.length > 0;

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

      <article className="Project">
        <div className="Project-leftColumn">
          <Link href={backHref} className="u-linkBack Projects-backLink">
            <svg className="Icon Icon-arrow-left">
              <use xlinkHref="#icon-arrow-left" />
            </svg>
            Back to projects
          </Link>
          {(project.title || subtitle) && (
            <h2 className="Project-title">
              {project.title && <span dangerouslySetInnerHTML={{ __html: project.title }} />}
              {subtitle ? (
                <span
                  className="Project-subTitle"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(subtitle) }}
                />
              ) : null}
            </h2>
          )}
          <div className="Project-metaWrap">
            <dl className="Project-meta">
              {client && (
                <>
                  <dt>Client</dt>
                  <dd>{client}</dd>
                </>
              )}
              {categories.length > 0 && (
                <>
                  <dt>Sector</dt>
                  <dd>
                    <ul className="Project-termList">
                      {categories.map((c, idx) => (
                        <li key={idx}>
                          <Link
                            href={
                              (c as ProjectCategory).slug
                                ? `/portfolio?category=${(c as ProjectCategory).slug}`
                                : backHref
                            }
                          >
                            {(c as ProjectCategory).name ?? (c as ProjectCategory).slug ?? ""}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </>
              )}

              {value && (
                <>
                  <dt>Value</dt>
                  <dd>{value}</dd>
                </>
              )}
              {completion && (
                <>
                  <dt>Completion</dt>
                  <dd>{completion}</dd>
                </>
              )}

              {services.length > 0 && (
                <>
                  <dt>Services</dt>
                  <dd>
                    <ul className="Project-termList">
                      {services.map((s, idx) => (
                        <li key={idx}>
                          <Link
                            href={
                              (s as ProjectService).slug
                                ? `/portfolio?service=${(s as ProjectService).slug}`
                                : backHref
                            }
                          >
                            {(s as ProjectService).name ?? (s as ProjectService).slug ?? ""}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </>
              )}

              {enableLocations && (
                <>
                  <dt>Locations</dt>
                  <dd>
                    <ul className="Project-termList">
                      {locations.map((l, idx) => (
                        <li key={idx}>
                          <Link
                            href={
                              (l as ProjectLocation).slug
                                ? `/portfolio?location=${(l as ProjectLocation).slug}`
                                : backHref
                            }
                          >
                            {(l as ProjectLocation).name ?? (l as ProjectLocation).slug ?? ""}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
        <div className="Project-rightColumn">
          <PostCarousel featuredImage={project.featuredImage} carousel={project.carousel} />

          <section className="Project-contentRow">
            <div className="Project-detailsWrap">
              <div className="rte" dangerouslySetInnerHTML={{ __html: project.content ?? "" }} />
            </div>
          </section>
        </div>
      </article>
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
