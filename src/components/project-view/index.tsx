import Link from "next/link";
import type {
  Project,
  ProjectCategory,
  ProjectLocation,
  ProjectService,
} from "@/graphql/generated/graphql";
import { normalizeContentHtml } from "@/lib/utilities/replaceDomain";
import { sanitizeHTML } from "@/lib/utilities/sanitizeHtml";

import PostCarousel from "@/components/post-carousel";
import BackToProjectsLink from "./back-link.client";
import MediaImage from "../shared/media/image";

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
        <BackToProjectsLink fallbackHref={backHref} />
        <h2 className="Project-title">
          {project.title}
          {project.projectFields?.subtitle && (
            <>
              <br />
              <span className="Project-subTitle">{project.projectFields.subtitle}</span>
            </>
          )}
        </h2>
        <div className="Project-metaWrap">
          <dl className="Project-meta">
            {project.projectFields?.client && (
              <>
                <dt>Client</dt>
                <dd>{project.projectFields.client}</dd>
              </>
            )}
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
            {project.projectFields?.value && (
              <>
                <dt>Value</dt>
                <dd>{project.projectFields.value}</dd>
              </>
            )}
            {project.projectFields?.completion && (
              <>
                <dt>Completion</dt>
                <dd>{project.projectFields.completion}</dd>
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
        {project.featuredImage?.node && (
          <div className="LazyLoad u-spaceAfterHuge">
            <MediaImage {...project.featuredImage.node} />
            {project.featuredImage.node.caption && (
              <div
                className="MediaCaption"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(project.featuredImage.node.caption),
                }}
              />
            )}
          </div>
        )}
        <section className="Project-contentRow">
          <div className="Project-detailsWrap">
            <div
              className="rte"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(normalizeContentHtml(project.content ?? "")) }}
            />
          </div>
        </section>
        {project.carouselEnabled !== false && project.carousel?.slides && project.carousel.slides.length > 0 && (
          <div className="u-spaceBeforeHuge">
            <PostCarousel carousel={project.carousel as any} />
          </div>
        )}
      </div>
    </article>
  );
}
