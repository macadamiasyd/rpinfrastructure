import type { WithAcfOptionsPageThemeSettings } from "@/graphql/generated/graphql";
import { SiteSettingsQuery } from "@/graphql/queries";

import { query } from "../api/client";

/**
 * Greppable prefix for every failure in here. These settings feed the header,
 * the top banner and the footer, so losing them changes every page on the
 * site at once — it must never scroll past in a log unnoticed.
 */
const ALARM = "[RPI][site-settings]";

export const getSiteSettings = async (): Promise<WithAcfOptionsPageThemeSettings | undefined> => {
  try {
    const { data } = await query<WithAcfOptionsPageThemeSettings>({
      query: SiteSettingsQuery,
      context: { fetchOptions: { next: { tags: ["site-settings"], revalidate: 3600 } } },
    });

    // A successful response with no themeSettings is the shape a backend
    // plugin update takes: on 2026-09-09 wpgraphql-acf 3.0 made ACF options
    // pages an explicit opt-in and the field left the schema entirely. The
    // old code returned this quietly and the layout rendered nothing around
    // the content.
    if (!data?.themeSettings) {
      console.error(
        `${ALARM} themeSettings is missing from the GraphQL response. The ACF options page has probably dropped out of the schema — check that acf_add_options_page() still passes show_in_graphql. The site will render with menu data only: no logo, no top banner, no ABN or copyright.`
      );
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${ALARM} query failed, falling back to menu data only: ${message}`);
    return undefined;
  }
};
