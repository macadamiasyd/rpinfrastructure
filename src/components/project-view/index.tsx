import Link from "next/link";
import type {
  Project,
  ProjectCategory,
  ProjectLocation,
  ProjectService,
} from "@/graphql/generated/graphql";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import PostCarousel from "@/components/post-carousel";

type Props = {
  project: Project;
  backHref?: string;
};

export default function ProjectView({ project, backHref = "/portfolio" }: Props) {
  const categories = ((project.projectCategories?.nodes ?? []).filter(Boolean) ??
    []) as ProjectCategory[];
  const services = ((project.projectServices?.nodes ?? []).filter(Boolean) ??
    []) as ProjectService[];
  const locations = ((project.projectLocations?.nodes ?? []).filter(Boolean) ??
    []) as ProjectLocation[];
  const buildHref = (key: "category" | "service" | "location", slug?: string | null) => {
    if (slug) {
      return `/portfolio?${key}=${encodeURIComponent(slug)}`;
    }
    return "/portfolio";
  };
  return (
    <article className="Project">
      <div className="Project-leftColumn">
        <Link href={backHref} className="u-linkBack Projects-backLink">
          <svg className="Icon Icon-arrow-left">
            <use xlinkHref="#icon-arrow-left" />
          </svg>
          Back to projects
        </Link>
        <h2 className="Project-title">
          {project.title && (
            <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(project.title) }} />
          )}
        </h2>
        <div className="Project-metaWrap">
          <dl className="Project-meta">
            {categories.length > 0 && (
              <>
                <dt>Sector</dt>
                <dd>
                  <ul className="Project-termList">
                    {categories.map((c: ProjectCategory, idx: number) => (
                      <li key={idx}>
                        <Link href={buildHref("category", c.slug)}>{c.name ?? c.slug ?? ""}</Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
            {services.length > 0 && (
              <>
                <dt>Services</dt>
                <dd>
                  <ul className="Project-termList">
                    {services.map((s: ProjectService, idx: number) => (
                      <li key={idx}>
                        <Link href={buildHref("service", s.slug)}>{s.name ?? s.slug ?? ""}</Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
            {locations.length > 0 && (
              <>
                <dt>Locations</dt>
                <dd>
                  <ul className="Project-termList">
                    {locations.map((l: ProjectLocation, idx: number) => (
                      <li key={idx}>
                        <Link href={buildHref("location", l.slug)}>{l.name ?? l.slug ?? ""}</Link>
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
        <PostCarousel
          featuredImage={project.featuredImage as any}
          carousel={project.carousel as any}
        />
        <section className="Project-contentRow">
          <div className="Project-detailsWrap">
            <div
              className="rte"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(project.content ?? "") }}
            />
          </div>
        </section>
      </div>
    </article>
  );
}
