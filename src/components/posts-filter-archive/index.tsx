"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, RootQueryToPostConnection } from "@/graphql/generated/graphql";
import { queryPosts } from "@/lib/utilities/queryPosts";

import type { PostsQueryType } from "@/types/posts";
import ArchiveListing from "../archive-listing";
import PostsFilter from "../posts-filter";

type Props = {
  categories?: Category[];
  query?: {
    posts: RootQueryToPostConnection;
  };
  queryParams?: PostsQueryType;
  showHeader?: boolean;
};

export default function PostsFilterArchive({
  categories,
  query,
  queryParams,
  showHeader = true,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [postsState, setPostsState] = useState<RootQueryToPostConnection | undefined>(query?.posts);
  const activeSlugs = useRef<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lastAppliedKeyRef = useRef<string>("");

  const allCategories = (categories ?? []).flatMap((c) => [
    c,
    ...(c.children?.nodes ?? []).map((n) => ({
      databaseId: n?.databaseId ?? 0,
      slug: n?.slug ?? "",
    })),
  ]);
  const descendantsMap = new Map<string, number[]>();
  (categories ?? []).forEach((c) => {
    const childIds = (c.children?.nodes ?? [])
      .map((n) => n?.databaseId ?? 0)
      .filter((id) => id > 0);
    if (c.slug) {
      descendantsMap.set(c.slug, childIds);
    }
  });

  const slugToId = (slug: string): number | null => {
    const found = allCategories.find((c) => c.slug === slug);
    return found ? (found.databaseId as number) : null;
  };

  const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value: slug, checked } = e.target;
    if (!slug) return;
    const id = slugToId(slug);
    if (!id) return;
    if (checked) {
      activeSlugs.current.add(slug);
    } else {
      activeSlugs.current.delete(slug);
    }
    const ids = Array.from(
      new Set(
        Array.from(activeSlugs.current)
          .flatMap((s) => [slugToId(s), ...(descendantsMap.get(s) ?? [])])
          .filter((n): n is number => typeof n === "number" && n > 0)
      )
    );

    try {
      setLoading(true);
      const tags = ["posts-archive"];
      if (ids.length > 0) {
        tags.push(`posts:categoryIn:${ids.join(",")}`);
      }
      if (queryParams?.year || queryParams?.month || queryParams?.day) {
        tags.push(
          `posts:date:${queryParams?.year ?? ""}-${queryParams?.month ?? ""}-${queryParams?.day ?? ""}`
        );
      }
      const params = ids.length > 0 ? { ...queryParams, categoryIn: ids } : { ...queryParams };
      const result = await queryPosts({ params, tags });
      setPostsState(result?.posts);
    } catch {
    } finally {
      setLoading(false);
    }
    const slugs = Array.from(activeSlugs.current);
    const params = new URLSearchParams();
    if (slugs.length > 0) {
      params.set("categories", slugs.join(","));
    }
    const url = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    lastAppliedKeyRef.current = `${queryParams?.year ?? ""}-${queryParams?.month ?? ""}-${queryParams?.day ?? ""}|${slugs.join(",")}`;
    router.replace(url, {
      scroll: false,
    });
  };

  useEffect(() => {
    const catsParam = searchParams.get("categories");
    const dateKey = `${queryParams?.year ?? ""}-${queryParams?.month ?? ""}-${queryParams?.day ?? ""}`;
    if (!catsParam) {
      const targetKey = `${dateKey}|`;
      if (lastAppliedKeyRef.current === targetKey) {
        return;
      }
      activeSlugs.current.clear();
      setLoading(true);
      const tags = ["posts-archive"];
      if (queryParams?.year || queryParams?.month || queryParams?.day) {
        tags.push(`posts:date:${dateKey}`);
      }
      queryPosts({ params: { ...queryParams }, tags })
        .then((result) => {
          setPostsState(result?.posts);
          lastAppliedKeyRef.current = targetKey;
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
      return;
    }
    const slugs = catsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const targetKey = `${dateKey}|${slugs.join(",")}`;
    if (slugs.length === 0) {
      if (lastAppliedKeyRef.current === targetKey) {
        return;
      }
      activeSlugs.current.clear();
      setLoading(true);
      const tags = ["posts-archive"];
      if (queryParams?.year || queryParams?.month || queryParams?.day) {
        tags.push(`posts:date:${dateKey}`);
      }
      queryPosts({ params: { ...queryParams }, tags })
        .then((result) => {
          setPostsState(result?.posts);
          lastAppliedKeyRef.current = targetKey;
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
      return;
    }
    if (lastAppliedKeyRef.current === targetKey) {
      return;
    }
    activeSlugs.current.clear();
    for (const s of slugs) {
      activeSlugs.current.add(s);
    }
    const ids = Array.from(
      new Set(
        slugs
          .flatMap((s) => [slugToId(s), ...(descendantsMap.get(s) ?? [])])
          .filter((n): n is number => typeof n === "number" && n > 0)
      )
    );
    setLoading(true);
    const tags = ["posts-archive"];
    if (ids.length > 0) {
      tags.push(`posts:categoryIn:${ids.join(",")}`);
    }
    if (queryParams?.year || queryParams?.month || queryParams?.day) {
      tags.push(`posts:date:${dateKey}`);
    }
    const params = ids.length > 0 ? { ...queryParams, categoryIn: ids } : { ...queryParams };
    queryPosts({ params, tags })
      .then((result) => {
        setPostsState(result?.posts);
        lastAppliedKeyRef.current = targetKey;
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const currentQueryParams: PostsQueryType | undefined = activeSlugs.current.size
    ? {
        ...queryParams,
        categoryIn: Array.from(activeSlugs.current)
          .map(slugToId)
          .filter((n): n is number => typeof n === "number" && n > 0),
      }
    : queryParams;

  return (
    <ArchiveListing
      params={{ posts: postsState! }}
      queryParams={currentQueryParams}
      loading={loading}
      header={
        showHeader && categories && categories.length > 0 ? (
          <PostsFilter changeHandler={changeHandler} categories={categories} />
        ) : undefined
      }
    />
  );
}
