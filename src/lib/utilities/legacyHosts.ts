/**
 * Rewrite absolute URLs that point at a WPMU DEV staging host to site-relative
 * paths.
 *
 * Some ACF fields (notably the footer's copyright section) had a full staging
 * URL baked in during migration, e.g.
 *   https://rpinfrastructurerebuild.multi.phpstg.com/home/privacy
 * which leaks the staging hostname publicly and will 404 once that host is
 * retired. Stripping the origin leaves "/home/privacy".
 *
 * This is a safety net for stale content, not a substitute for fixing the
 * stored value — prefer correcting the field in WordPress.
 */
const STAGING_HOST = /https?:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.phpstg\.com/gi;

export const stripStagingHosts = (html?: string | null): string =>
  (html ?? "").replace(STAGING_HOST, "");
