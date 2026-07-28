"use client";

import Link from "next/link";
import { useFilterQuery } from "@/lib/hooks/useFilterQuery";

type Props = {
  /** Href used before hydration and when no filters are active. */
  fallbackHref: string;
};

export default function BackToProjectsLink({ fallbackHref }: Props) {
  const filterQuery = useFilterQuery();
  const href = filterQuery ? `/portfolio?${filterQuery}` : fallbackHref;

  return (
    <Link href={href} className="u-linkBack Projects-backLink">
      <svg className="Icon Icon-arrow-left">
        <use xlinkHref="#icon-arrow-left" />
      </svg>
      Back to projects
    </Link>
  );
}
