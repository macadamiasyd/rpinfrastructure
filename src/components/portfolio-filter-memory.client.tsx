"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FILTER_STORAGE_KEY } from "@/lib/hooks/useFilterQuery";

/**
 * Records the visitor's current portfolio filters for the session so a project
 * page can send them back to the list they came from.
 *
 * Mounted in the root layout because the portfolio archive filters client-side:
 * the query string changes without a document load, so this needs to observe
 * navigation rather than read a request header. Renders nothing.
 */
export default function PortfolioFilterMemory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname?.startsWith("/portfolio")) {
      return;
    }

    const queryString = searchParams?.toString() ?? "";
    try {
      if (queryString) {
        sessionStorage.setItem(FILTER_STORAGE_KEY, queryString);
      } else {
        sessionStorage.removeItem(FILTER_STORAGE_KEY);
      }
    } catch {
      // sessionStorage unavailable — filter memory is a nicety, not required.
    }
  }, [pathname, searchParams]);

  return null;
}
