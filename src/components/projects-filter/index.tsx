"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import type { ProjectCategory, ProjectLocation, ProjectService } from "@/graphql/generated/graphql";
import { buildProjectTaxonomyTree } from "@/lib/utilities/buildProjectTaxonomyTree";

type Props = {
  filters: (ProjectCategory | ProjectService | ProjectLocation)[][];
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProjectsFilter({ filters, changeHandler }: Props) {
  const filtersTree = filters.map((filter) => buildProjectTaxonomyTree(filter));
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [groupCounts, setGroupCounts] = useState<Record<number, number>>({});
  const searchParams = useSearchParams();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const openId = Number(Object.keys(open).find((k) => open[Number(k)]));
      if (Number.isNaN(openId)) return;
      const container = itemRefs.current[openId];
      if (!container) return;
      const target = e.target as Node | null;
      if (target && !container.contains(target)) {
        setOpen({});
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [open]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen({});
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, []);
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam) return;
    const input = document.querySelector<HTMLInputElement>(
      '.ProjectsFilter input[name="project_category"][value="' + categoryParam + '"]'
    );
    if (!input) return;
    if (!input.checked) {
      const t = setTimeout(() => {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }, 0);
      return () => clearTimeout(t);
    }
  }, [searchParams]);
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (!serviceParam) return;
    const input = document.querySelector<HTMLInputElement>(
      '.ProjectsFilter input[name="project_services"][value="' + serviceParam + '"]'
    );
    if (!input) return;
    if (!input.checked) {
      const t = setTimeout(() => {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }, 0);
      return () => clearTimeout(t);
    }
  }, [searchParams]);
  useEffect(() => {
    const locationParam = searchParams.get("location");
    if (!locationParam) return;
    const input = document.querySelector<HTMLInputElement>(
      '.ProjectsFilter input[name="project_locations"][value="' + locationParam + '"]'
    );
    if (!input) return;
    if (!input.checked) {
      const t = setTimeout(() => {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }, 0);
      return () => clearTimeout(t);
    }
  }, [searchParams]);
  useEffect(() => {
    const computeCounts = () => {
      const counts: Record<number, number> = {};
      Object.keys(itemRefs.current).forEach((key) => {
        const id = Number(key);
        const container = itemRefs.current[id];
        counts[id] = container
          ? container.querySelectorAll('input[type="checkbox"]:checked').length
          : 0;
      });
      setGroupCounts(counts);
    };
    computeCounts();
    const onChange = () => computeCounts();
    document.addEventListener("change", onChange, true);
    return () => document.removeEventListener("change", onChange, true);
  }, []);

  return (
    <div className="ProjectsFilter">
      {filtersTree.map((filter, id) => (
        <div
          className="ProjectsFilter__Item"
          key={id}
          ref={(el) => {
            itemRefs.current[id] = el;
          }}
        >
          {filter.nodes && filter.nodes.length > 0 && (
            <div>
              <button
                type="button"
                aria-expanded={Boolean(open[id])}
                aria-controls={`filter-${filter.taxonomy}-${id}`}
                onClick={() => setOpen((prev) => (prev[id] ? {} : { [id]: true }))}
              >
                {filter.taxonomyLabel}
                {groupCounts[id] ? (
                  <span
                    className="ProjectsFilter__Badge"
                    aria-label={`Selected ${groupCounts[id]}`}
                  >
                    {groupCounts[id]}
                  </span>
                ) : null}
              </button>
              <div
                id={`filter-${filter.taxonomy}-${id}`}
                className={`Menu-dropdown${open[id] ? " is-active" : ""}`}
              >
                {filter.nodes.map((node) => (
                  <div key={node.databaseId}>
                    <input
                      type="checkbox"
                      id={`${filter.taxonomy}-${node.databaseId}`}
                      name={filter.taxonomy}
                      value={node.slug as string}
                      onChange={changeHandler}
                    />
                    <label htmlFor={`${filter.taxonomy}-${node.databaseId}`}>{node.name}</label>
                    {"children" in node && node.children && node.children.nodes.length > 0 && (
                      <div>
                        {node.children.nodes.map((child) => (
                          <div key={(child as any).databaseId}>
                            <input
                              type="checkbox"
                              id={`${filter.taxonomy}-${(child as any).databaseId}`}
                              name={filter.taxonomy}
                              value={(child as any).slug}
                              onChange={changeHandler}
                            />
                            <label htmlFor={`${filter.taxonomy}-${(child as any).databaseId}`}>
                              {(child as any).name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
