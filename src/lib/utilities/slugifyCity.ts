/**
 * Turn an office city name into a URL fragment.
 *
 * Shared deliberately: the footer builds `/contact#<slug>` links and the
 * Locations block renders the matching `id`. If the two ever diverge the
 * footer links silently scroll nowhere, so both must use this one function.
 */
export function slugifyCity(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
