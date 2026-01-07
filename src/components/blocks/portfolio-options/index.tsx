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
            categories={taxonomyData?.projectCategories?.nodes}
            locations={taxonomyData?.projectLocations?.nodes}
            services={taxonomyData?.projectServices?.nodes}
            query={projects}
          />
          <div className="row">
            <div className="columns large-5">
              {opts?.pullquote && (
                <div
                  className="PullQuote"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(opts.pullquote) }}
                />
              )}
            </div>
            <div className="columns large-4 large-offset-5 end">
              {opts?.portfolioContact && (
                <div
                  className="Portfolio-contact"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(opts.portfolioContact) }}
                />
              )}
            </div>
          </div>
        </section>
      </div>
      {slides.length > 0 && <ProjectsCarousel slides={slides as PortfolioOptionsSlides[]} />}
    </>
  );
}
