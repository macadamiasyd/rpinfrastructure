import { stripStagingHosts } from "./legacyHosts";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Public base URL of the frontend, without a trailing slash.
 *
 * PUBLIC_URL was referenced by the sitemaps but never set in Vercel, which
 * produced `undefined/about/` entries — hence the fallbacks.
 */
export const getSiteUrl = (): string =>
  (process.env.PUBLIC_URL || process.env.FRONTEND_URL || process.env.SITE_URL || "").replace(
    /\/$/,
    ""
  );

/**
 * Swap the WordPress backend host for the frontend host.
 *
 * Media is deliberately left alone: `/wp-content/...` is still served by
 * WordPress, so only non-media URLs are rewritten.
 */
export const replaceDomain = (url: string): string => {
  const oldDomain = process.env.API_DOMAIN;
  const newDomain = process.env.FRONTEND_DOMAIN;
  if (!url || !oldDomain || !newDomain) return url ?? "";

  return url.replace(
    new RegExp(`(https?://)${escapeRegExp(oldDomain)}(?![^"]*wp-content)`, "g"),
    `$1${newDomain}`
  );
};

/**
 * Normalise absolute URLs inside editor content so links stay on the frontend.
 *
 * WordPress stores absolute URLs, so content authored in the admin points at
 * the backend host (e.g. https://admin.rpinfrastructure.com.au/our-approach/).
 * Left as-is those links bounce visitors off the site and into the CMS.
 *
 * Backend links become site-relative, which keeps them correct on production,
 * preview deployments and localhost alike. `/wp-content/` URLs are preserved —
 * media is still served by WordPress.
 */
export const normalizeContentHtml = (html?: string | null): string => {
  const source = stripStagingHosts(html);
  if (!source) return "";

  const backendHosts = [process.env.API_DOMAIN, process.env.SITE_DOMAIN].filter(
    (host): host is string => !!host
  );
  const frontendHosts = [process.env.FRONTEND_DOMAIN].filter(
    (host): host is string => !!host
  );

  let result = source;

  for (const host of [...new Set([...backendHosts, ...frontendHosts])]) {
    // Strip the origin, but never for media paths.
    result = result.replace(
      new RegExp(`https?://${escapeRegExp(host)}(?!/wp-content)`, "g"),
      ""
    );
  }

  // A bare origin with no path would otherwise collapse to href="", which
  // resolves to the current page rather than home.
  return result.replace(/(href|src)=""/g, '$1="/"');
};

export const normalizeAppHref = (
  url?: string | null
): { href: string | null; isInternal: boolean } => {
  if (!url) return { href: null, isInternal: false };
  const replaced = replaceDomain(url);
  try {
    const u = new URL(replaced);
    const front = process.env.FRONTEND_DOMAIN;
    if (front && u.host === front) {
      return { href: `${u.pathname}${u.search}${u.hash}`, isInternal: true };
    }
  } catch {}
  const isInternal = replaced.startsWith("/") && !replaced.startsWith("//");
  return { href: replaced, isInternal };
};
