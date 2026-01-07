"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  TaxQueryField,
  TaxQueryOperator,
  type ProjectCategory,
  type ProjectLocation,
  type ProjectService,
  type RootQueryToProjectConnection,
  type TaxArray,
  type TaxQuery,
} from "@/graphql/generated/graphql";
import { projectTaxonomyEnumMap } from "@/lib/utilities/projectTaxonomyEnumMap";
import { queryProjects } from "@/lib/utilities/queryProjects";

import ProjectsFilter from "../projects-filter";
import ProjectsListing from "../projects-listing";

type FilterGroup = ProjectCategory[] | ProjectLocation[] | ProjectService[];
type Props = {
  categories?: ProjectCategory[];
  locations?: ProjectLocation[];
  services?: ProjectService[];
  query?: {
    projects: RootQueryToProjectConnection;
  };
};

export default function ProjectFilterArchive({ query, categories, locations, services }: Props) {
  const filters = [categories, locations, services].filter((group): group is FilterGroup =>
    Boolean(group)
  );
  const [loading, setLoading] = useState(false);
  const activeFilters = useRef<Record<string, string[]>>({});
  const projectsQuery = useRef<RootQueryToProjectConnection | undefined>(query?.projects);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lastAppliedKeyRef = useRef<string>("");

  const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name: taxonomy, value: slug, checked } = e.target;

    const current = activeFilters.current[taxonomy] ?? [];

    if (checked) {
      activeFilters.current = {
        ...activeFilters.current,
        [taxonomy]: Array.from(new Set([...current, slug])),
      };
    } else {
      const next = current.filter((s) => s !== slug);
      if (next.length === 0) {
        const rest = { ...activeFilters.current };
        delete rest[taxonomy];
        activeFilters.current = rest;
      } else {
        activeFilters.current = { ...activeFilters.current, [taxonomy]: next };
      }
    }

    const taxQuery = generateTaxQuery(activeFilters.current);

    try {
      setLoading(true);
      const tags = ["projects-archive"];
      if (taxQuery?.taxArray && taxQuery?.taxArray.length > 0) {
        for (const relation of taxQuery.taxArray) {
          if (relation) {
            tags.push(`projects:${relation.taxonomy}:${relation.terms?.join(",")}`);
          }
        }
      }
      const result = await queryProjects({
        taxQuery,
        tags,
      });
      projectsQuery.current = result?.projects;
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
      const params = new URLSearchParams();
      const cat = activeFilters.current.project_category;
      const srv = activeFilters.current.project_services;
      const loc = activeFilters.current.project_locations;
      if (cat && cat.length > 0) params.set("category", cat[cat.length - 1]);
      if (srv && srv.length > 0) params.set("service", srv[srv.length - 1]);
      if (loc && loc.length > 0) params.set("location", loc[loc.length - 1]);
      const key = `${cat?.join(",") ?? ""}|${srv?.join(",") ?? ""}|${loc?.join(",") ?? ""}`;
      lastAppliedKeyRef.current = key;
      const url = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      router.replace(url, { scroll: false });
    }
  };
  const generateTaxQuery = (filters: Record<string, string[]>): TaxQuery | undefined => {
    if (Object.keys(filters).length > 0) {
      return {
        taxArray: Object.keys(filters)
          .map((key) => {
            if (
              key in projectTaxonomyEnumMap &&
              projectTaxonomyEnumMap[key as keyof typeof projectTaxonomyEnumMap]
            ) {
              return {
                taxonomy: projectTaxonomyEnumMap[key as keyof typeof projectTaxonomyEnumMap],
                operator: TaxQueryOperator.In,
                field: TaxQueryField.Slug,
                terms: filters[key],
              };
            }
            return false;
          })
          .filter(Boolean) as TaxArray[],
      };
    }
    return undefined;
  };

  useEffect(() => {
    const category = searchParams.get("category");
    const service = searchParams.get("service");
    const location = searchParams.get("location");
    const key = `${category ?? ""}|${service ?? ""}|${location ?? ""}`;
    if (lastAppliedKeyRef.current === key) return;
    if (!category && !service && !location) return;
    setLoading(true);
    if (category) {
      activeFilters.current = {
        ...activeFilters.current,
        project_category: Array.from(
          new Set([...(activeFilters.current.project_category ?? []), category])
        ),
      };
    }
    if (service) {
      activeFilters.current = {
        ...activeFilters.current,
        project_services: Array.from(
          new Set([...(activeFilters.current.project_services ?? []), service])
        ),
      };
    }
    if (location) {
      activeFilters.current = {
        ...activeFilters.current,
        project_locations: Array.from(
          new Set([...(activeFilters.current.project_locations ?? []), location])
        ),
      };
    }
    const taxQuery = generateTaxQuery(activeFilters.current);
    const tags: string[] = ["projects-archive"];
    if (taxQuery?.taxArray && taxQuery?.taxArray.length > 0) {
      for (const relation of taxQuery.taxArray) {
        if (relation) {
          tags.push(`projects:${relation.taxonomy}:${relation.terms?.join(",")}`);
        }
      }
    }
    queryProjects({ taxQuery, tags })
      .then((result) => {
        projectsQuery.current = result?.projects;
        lastAppliedKeyRef.current = key;
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <>
      {filters && filters.length > 0 && (
        <ProjectsFilter changeHandler={changeHandler} filters={filters} />
      )}
      <ProjectsListing
        query={projectsQuery.current}
        taxQuery={generateTaxQuery(activeFilters.current)}
        loading={loading}
      />
    </>
  );
}
