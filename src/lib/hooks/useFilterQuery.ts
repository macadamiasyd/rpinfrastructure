"use client";

import { useEffect, useState } from "react";

const FILTER_KEYS = ["category", "service", "location"] as const;

/** sessionStorage key holding the visitor's most recent portfolio filter query. */
export const FILTER_STORAGE_KEY = "rpi:portfolio-filters";

/**
 * Resolve the portfolio filter query string on the client.
 *
 * Precedence:
 *   1. filters present in the current URL
 *   2. the last filter applied on /portfolio this session
 *   3. filters on the referring /portfolio URL (hard navigation)
 *   4. none — callers fall back to their own default href
 *
 * This replaces a server-side `headers()` / `searchParams` read. Doing the work
 * on the client is what lets project pages stay static and CDN-cacheable; the
 * first paint uses the caller's fallback and the filter-aware href is applied
 * on hydration.
 *
 * Step 2 matters because the portfolio archive filters client-side — it rewrites
 * the query string without a document load, so `document.referrer` alone misses
 * service and location filters.
 */
export function useFilterQuery(): string {
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    const current = new URLSearchParams(window.location.search);
    const fromCurrent = new URLSearchParams();
    for (const key of FILTER_KEYS) {
      const value = current.get(key);
      if (value) {
        fromCurrent.set(key, value);
      }
    }

    if (fromCurrent.toString()) {
      setFilterQuery(fromCurrent.toString());
      return;
    }

    try {
      const remembered = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (remembered) {
        setFilterQuery(remembered);
        return;
      }
    } catch {
      // sessionStorage unavailable (private mode / blocked) — fall through.
    }

    if (!document.referrer) {
      return;
    }

    try {
      const referrer = new URL(document.referrer);
      if (
        referrer.origin === window.location.origin &&
        referrer.pathname.startsWith("/portfolio")
      ) {
        setFilterQuery(referrer.search.replace(/^\?/, ""));
      }
    } catch {
      // Malformed referrer — leave the fallback in place.
    }
  }, []);

  return filterQuery;
}
