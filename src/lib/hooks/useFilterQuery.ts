"use client";

import { useEffect, useState } from "react";

const FILTER_KEYS = ["category", "service", "location"] as const;

/**
 * Resolve the portfolio filter query string on the client.
 *
 * Precedence matches the logic this replaced, which ran on the server:
 *   1. filters present in the current URL
 *   2. filters carried on the referring /portfolio URL
 *   3. none — callers fall back to their own default href
 *
 * Reading location/referrer in an effect (rather than from `headers()` or
 * `searchParams` on the server) is what lets project pages stay static and be
 * served from the CDN. The first paint uses the caller's fallback; the filter
 * aware href is applied on hydration.
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
