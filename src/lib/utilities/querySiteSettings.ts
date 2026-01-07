import type { WithAcfOptionsPageThemeSettings } from "@/graphql/generated/graphql";
import { SiteSettingsQuery } from "@/graphql/queries";

import { query } from "../api/client";

export const getSiteSettings = async (): Promise<WithAcfOptionsPageThemeSettings | undefined> => {
  try {
    const { data } = await query<WithAcfOptionsPageThemeSettings>({
      query: SiteSettingsQuery,
      context: { fetchOptions: { next: { tags: ["site-settings"], revalidate: 3600 } } },
    });

    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
