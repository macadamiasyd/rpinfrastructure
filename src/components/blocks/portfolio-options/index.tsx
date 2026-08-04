import type {
  AcfPortfolioOptions,
  ProjectCategory,
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

type CategoryNodes = RootQueryToProjectCategoryConnection["nodes"];

/**
 * Drop sub-sectors that have no projects yet.
 *
 * A sub-sector with nothing in it renders as a filter option that returns an
 * empty grid. Parents are always kept — several hold projects only via their
 * children, so filtering on a parent's own count would remove those groups
 * entirely (counts track direct assignments only).
 *
 * This stops being load-bearing once every sub-sector has projects.
 */
function hideEmptyChildren(nodes: CategoryNodes | undefined): CategoryNodes {
  // The generated node type is an intersection (Node & ProjectCategory) that
  // nothing maps back onto cleanly — narrow once here, restore it on the way out.
  const categories = (nodes ?? []) as ProjectCategory[];
  return categories.map((category) => {
    const children = (category.children?.nodes ?? []) as ProjectCategory[];
    const populated = children.filter((child) => (child?.count ?? 0) > 0);
    if (populated.length === children.length) return category;
    return { ...category, children: { ...category.children, nodes: populated } };
  }) as CategoryNodes;
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
            categories={hideEmptyChildren(taxonomyData?.projectCategories?.nodes)}
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
