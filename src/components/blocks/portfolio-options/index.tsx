import type {
  AcfPortfolioOptions,
  PortfolioOptionsSlides,
  RootQueryToProjectCategoryConnection,
  RootQueryToProjectLocationConnection,
  RootQueryToProjectServiceConnection,
} from "@/graphql/generated/graphql";
import { ProjectTaxonomiesQuery } from "@/graphql/queries";
import { query } from "@/lib/api/client";
import { queryProjects } from "@/lib/utilities/queryProjects";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import ProjectsCarousel from "@/components/projects-carousel";
import ProjectFilterArchive from "@/components/projects-filter-archive";

type TaxonomiesQueryResult = {
  projectCategories: RootQueryToProjectCategoryConnection;
  projectLocations: RootQueryToProjectLocationConnection;
  projectServices: RootQueryToProjectServiceConnection;
};

/**
 * Drop sub-sectors that have no projects yet.
 *
 * The sector tree was restructured to the client's chart before the projects
 * were re-tagged against it, so most sub-sectors are still empty and would
 * render as filter options that return nothing. Parents are always kept — three
 * of them (Transport, Water & Energy, Education Science & Technology) hold no
 * projects directly, only via their children, so filtering on the parent's own
 * count would remove those groups entirely.
 *
 * Remove this once the sub-sector tagging is populated.
 */
function hideEmptyChildren<T extends { count?: number | null; children?: { nodes?: unknown } }>(
  nodes: readonly (T | null)[] | null | undefined
) {
  return (nodes ?? []).filter(Boolean).map((node) => {
    const n = node as T & { children?: { nodes?: ({ count?: number | null } | null)[] | null } };
    const kids = (n.children?.nodes ?? []).filter(Boolean) as { count?: number | null }[];
    const populated = kids.filter((k) => (k.count ?? 0) > 0);
    if (populated.length === kids.length) return n;
    return { ...n, children: { ...(n.children ?? {}), nodes: populated } };
  });
}

export default async function PortfolioOptionsBlock({
  attributes,
  renderedHtml,
  portfolioOptions,
}: AcfPortfolioOptions) {
  const extraClass = attributes?.className ? ` ${attributes.className}` : "";
  const html = renderedHtml ?? "";
  const opts = portfolioOptions;
  const slides = (opts?.slides || []).filter(Boolean);

  const { data: taxonomyData } = await query<TaxonomiesQueryResult>({
    query: ProjectTaxonomiesQuery,
    context: { fetchOptions: { next: { tags: ["projects-taxonomies"], revalidate: 3600 } } },
  });

  const projects = await queryProjects({
    first: 12,
    tags: ["projects-archive"],
  });

  if (!html && !opts && slides.length === 0) return null;

  return (
    <>
      <div className="AppContent row page-template-portfolio" role="main">
        <section className={`Portfolio u-wrap${extraClass}`}>
          {html && <div className="rte" dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }} />}
          <div className="custom_project_headsec">
            {opts?.heading && (
              <h1 dangerouslySetInnerHTML={{ __html: sanitizeHTML(opts.heading) }} />
            )}
            {opts?.upperContent && (
              <div
                className="rte"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(opts.upperContent) }}
              />
            )}
          </div>
          <ProjectFilterArchive
            categories={hideEmptyChildren(taxonomyData?.projectCategories?.nodes) as typeof taxonomyData.projectCategories.nodes}
            locations={taxonomyData?.projectLocations?.nodes}
            services={taxonomyData?.projectServices?.nodes}
            query={projects}
          />
          <div className="row">
            {opts?.pullquote && (
              <div
                className="PullQuote"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(opts.pullquote) }}
              />
            )}
            {opts?.portfolioContact && (
              <div
                className="Portfolio-contact"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(opts.portfolioContact) }}
              />
            )}
            {slides.length > 0 && <ProjectsCarousel slides={slides as PortfolioOptionsSlides[]} />}
          </div>
        </section>
      </div>
    </>
  );
}
