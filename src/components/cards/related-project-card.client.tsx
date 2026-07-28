"use client";

import type { Project } from "@/graphql/generated/graphql";
import { useFilterQuery } from "@/lib/hooks/useFilterQuery";

import ProjectCard from "./project-card";

/**
 * ProjectCard for the related-projects rail on a project page, carrying the
 * active portfolio filters across project-to-project navigation. Resolves the
 * query client-side so the surrounding page can stay static.
 */
export default function RelatedProjectCard(props: Project & { subtitle?: string }) {
  const hrefQuery = useFilterQuery();
  return <ProjectCard {...props} hrefQuery={hrefQuery} />;
}
