"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/graphql/generated/graphql";

type Props = {
  categories: Category[];
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
};

type TreeNode = {
  databaseId: number;
  slug?: string | null;
  name?: string | null;
  children?: TreeNode[];
};

export default function PostsFilter({ categories, changeHandler }: Props) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [groupCounts, setGroupCounts] = useState<Record<number, number>>({});
  const searchParams = useSearchParams();

  const tree: TreeNode[] =
    categories.map((c) => ({
      databaseId: c.databaseId,
      slug: c.slug,
      name: c.name,
      children: (c.children?.nodes ?? []).map((n) => ({
        databaseId: n?.databaseId ?? 0,
        slug: n?.slug ?? "",
        name: n?.name ?? "",
      })),
    })) ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const openId = Number(Object.keys(open).find((k) => open[Number(k)]));
      if (Number.isNaN(openId)) return;
      const container = itemRefs.current[openId];
      if (!container) return;
      const target = e.target as Node | null;
      if (target && !container.contains(target)) {
        setOpen({ 0: false });
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [open]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen({ 0: false });
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, []);
  useEffect(() => {
    const catsParam = searchParams.get("categories");
    if (!catsParam) return;
    const slugs = catsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (slugs.length === 0) return;
    slugs.forEach((slug) => {
      const input = document.querySelector<HTMLInputElement>(
        '.ProjectsFilter input[name="category"][value="' + slug + '"]'
      );
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
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

  if (!tree.length) return null;

  return (
    <div className="ProjectsFilter PostsCategoriesFilter">
      <div
        className="ProjectsFilter__Item"
        data-id={0}
        ref={(el) => {
          itemRefs.current[0] = el;
        }}
      >
        <div>
          <button
            type="button"
            aria-expanded={Boolean(open[0])}
            aria-controls="filter-category-all"
            onClick={() => setOpen((prev) => ({ 0: !prev[0] }))}
          >
            Categories
            {groupCounts[0] ? (
              <span className="ProjectsFilter__Badge" aria-label={`Selected ${groupCounts[0]}`}>
                {groupCounts[0]}
              </span>
            ) : null}
          </button>
          <div id="filter-category-all" className={`Menu-dropdown${open[0] ? " is-active" : ""}`}>
            {tree.map((root) => (
              <div key={root.databaseId}>
                <input
                  type="checkbox"
                  id={`post-category-${root.slug}`}
                  name="category"
                  value={root.slug ?? ""}
                  onChange={changeHandler}
                />
                <label htmlFor={`post-category-${root.slug}`}>{root.name}</label>
                {root.children?.map((node) => (
                  <div key={node.databaseId}>
                    <input
                      type="checkbox"
                      id={`post-category-${node.slug}`}
                      name="category"
                      value={node.slug ?? ""}
                      onChange={changeHandler}
                    />
                    <label htmlFor={`post-category-${node.slug}`}>{node.name}</label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
