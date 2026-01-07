"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Menu, MenuItem } from "@/graphql/generated/graphql";
import { flatMenuToHierarchical } from "@/lib/utilities/flatMenuToHierarchiacal";
import { normalizeAppHref } from "@/lib/utilities/replaceDomain";
import clsx from "clsx";

interface ModifiedMenuItem extends MenuItem {
  children?: MenuItem[];
}

export default function Navigation({
  extraClasses,
  menuItems,
  id,
}: Menu & { extraClasses?: string[]; id?: string }) {
  if (!menuItems?.nodes?.length) {
    return null;
  }
  const items = flatMenuToHierarchical(menuItems.nodes);
  return (
    <nav role="navigation" id={id} className={clsx("navigation", extraClasses)}>
      <RecursiveMenu items={items} />
    </nav>
  );
}

function RecursiveMenu({ items }: { items: ModifiedMenuItem[] }) {
  const pathname = usePathname();
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const isOpen = useCallback((id?: string | null) => (id ? openSet.has(id) : false), [openSet]);
  const normalizeInternal = useCallback((uri?: string | null) => {
    if (!uri) return null;
    const { href, isInternal } = normalizeAppHref(uri);
    if (!href || !isInternal) return null;
    return href.replace(/\/+$/, "") || "/";
  }, []);
  const isItemActive = useCallback(
    (item?: ModifiedMenuItem) => {
      if (!item) return false;
      const current = pathname.replace(/\/+$/, "") || "/";
      const own = normalizeInternal(item.uri);
      if (own) {
        if (own === "/portfolio" && (current === "/project" || current.startsWith("/project/"))) {
          return true;
        }
        if (own === "/") {
          if (current === "/") return true;
        } else if (current === own || current.startsWith(own + "/")) {
          return true;
        }
      }
      if (item.children && item.children.length > 0) {
        return item.children.some((child) => {
          const childPath = normalizeInternal(child.uri);
          return !!childPath && (current === childPath || current.startsWith(childPath + "/"));
        });
      }
      return false;
    },
    [pathname, normalizeInternal]
  );
  const isItemExact = useCallback(
    (item?: ModifiedMenuItem) => {
      const current = pathname.replace(/\/+$/, "") || "/";
      const own = normalizeInternal(item?.uri);
      return !!own && current === own;
    },
    [pathname, normalizeInternal]
  );
  const toggle = useCallback((id?: string | null) => {
    if (!id) return;
    setOpenSet((prev) => {
      const next = new Set<string>();
      if (!prev.has(id)) {
        next.add(id);
      }
      return next;
    });
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setOpenSet(new Set()), 0);
    return () => clearTimeout(t);
  }, [pathname]);
  return (
    <ul className="Menu Menu--main" role="menubar">
      {items.map((item) => (
        <li
          key={item.id}
          className={clsx(
            "Menu-item",
            item.cssClasses,
            item.children && item.children.length > 0 && ["has-dropdown", "js-headerNavToggle"],
            isItemActive(item) && "is-active"
          )}
          aria-haspopup={item.children && item.children.length > 0 ? true : undefined}
          role="none"
        >
          <Link
            href={item.uri ?? ""}
            target={item.target ?? "_self"}
            className="Menu-itemLabel"
            title={item.target === "_blank" ? "Open in new tab" : undefined}
            role="menuitem"
            aria-current={isItemExact(item) ? "page" : undefined}
            aria-expanded={
              item.children && item.children.length > 0 ? isOpen(item.id) || false : undefined
            }
            aria-controls={
              item.children && item.children.length > 0 ? `submenu-${item.id}` : undefined
            }
            onClick={(e) => {
              if (!item.children || item.children.length === 0) return;
              const mobileNavOpen =
                typeof document !== "undefined" && document.body.classList.contains("is-navOpen");
              if (!mobileNavOpen) return;
              if (!isOpen(item.id)) {
                e.preventDefault();
                toggle(item.id ?? null);
              }
            }}
            onKeyDown={(e) => {
              if (!item.children || item.children.length === 0) return;
              if (e.key === "Enter") {
                if (!isOpen(item.id) || !item.uri) {
                  e.preventDefault();
                  toggle(item.id ?? null);
                }
                return;
              } else if (e.key === " ") {
                e.preventDefault();
                toggle(item.id ?? null);
                return;
              }
              if (e.key === "Escape") {
                e.preventDefault();
                if (isOpen(item.id)) toggle(item.id ?? null);
              }
            }}
          >
            {item.label}
          </Link>
          {item.children && item.children.length > 0 && (
            <ul
              className={clsx(
                "Menu-dropdown",
                "js-headerNavDropdown",
                isOpen(item.id) && "is-active"
              )}
              role="menu"
              aria-hidden={isOpen(item.id) ? undefined : true}
              id={`submenu-${item.id}`}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  if (isOpen(item.id)) toggle(item.id ?? null);
                }
              }}
            >
              {item.children.map((child) => (
                <li key={child.id} className={clsx("Menu-item", child.cssClasses)} role="none">
                  <Link
                    href={child.uri ?? ""}
                    target={child.target ?? "_self"}
                    className="Menu-itemLabel"
                    title={child.target === "_blank" ? "Open in new tab" : undefined}
                    role="menuitem"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
      <li className={clsx("Menu-item", "Menu-item--search")} role="none">
        <Link href="/search" className="Menu-itemLabel" role="menuitem" title="Search">
          <span className="Search Search--header">
            <svg className="Search-icon Icon Icon--magnify">
              <use xlinkHref="#icon-magnify" />
            </svg>
            <span className="show-for-sr">Search</span>
          </span>
        </Link>
      </li>
    </ul>
  );
}
