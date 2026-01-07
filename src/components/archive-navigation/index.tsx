"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/graphql/generated/graphql";

import PostsFilter from "../posts-filter";

type Props = {
  items: {
    label: string;
    uri: string;
  }[];
  title: string;
  activeYear?: number;
  categories?: Category[];
};
export default function ArchiveNavigation({ items, title, activeYear, categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeUri = activeYear ? `/news/${activeYear}` : "/news";
  if (!items.length) {
    return null;
  }
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: slug, checked } = e.target;
    if (!slug) return;
    const current = (searchParams.get("categories") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const set = new Set(current);
    if (checked) {
      set.add(slug);
    } else {
      set.delete(slug);
    }
    const nextSlugs = Array.from(set);
    const params = new URLSearchParams();
    if (nextSlugs.length > 0) {
      params.set("categories", nextSlugs.join(","));
    }
    const url = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(url, { scroll: false });
  };

  return (
    <div className="columns large-3">
      <h2 className="Post-title">{title}</h2>

      <h3 className="PostFilter-title">Show</h3>

      {categories && categories.length > 0 ? (
        <PostsFilter categories={categories} changeHandler={changeHandler} />
      ) : null}

      <ul className="PostFilter">
        {items.map((item) => {
          const cats = searchParams.get("categories");
          const href = cats ? `${item.uri}?categories=${encodeURIComponent(cats)}` : item.uri;
          return (
            <li className="PostFilter-item" key={item.uri}>
              <Link href={href} className={activeUri === item.uri ? "is-active" : ""}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
