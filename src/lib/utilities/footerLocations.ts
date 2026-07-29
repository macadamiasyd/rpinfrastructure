import { ContactLocationsQuery } from "@/graphql/queries/page";

import { query } from "../api/client";

/** Minimal shape the footer needs — just enough to render the city links. */
export type FooterLocation = { city?: string | null };

/**
 * Office list for the footer, read from the Locations block on the Contact page.
 *
 * The Contact page block is the single source of truth for offices; this used to
 * come from the separate `themeSettings.locationsOld` ACF options field, which
 * meant offices had to be maintained in two places and silently drifted apart.
 *
 * Tagged with `page:contact` so the revalidation plugin refreshes the footer
 * site-wide as soon as the Contact page is updated.
 */
export const getFooterLocations = async (): Promise<FooterLocation[]> => {
  try {
    const { data } = await query<{
      page?: { editorBlocks?: ({ locations?: { locations?: FooterLocation[] } } | null)[] };
    }>({
      query: ContactLocationsQuery,
      context: {
        fetchOptions: {
          next: { tags: ["contact-locations", "page:contact"], revalidate: 3600 },
        },
      },
    });

    for (const block of data?.page?.editorBlocks ?? []) {
      const locations = block?.locations?.locations;
      if (Array.isArray(locations) && locations.length > 0) {
        return locations.filter(Boolean).map((location) => ({ city: location?.city ?? null }));
      }
    }

    return [];
  } catch (error) {
    console.error(`Failed to load footer locations: ${error}`);
    return [];
  }
};
