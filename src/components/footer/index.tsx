import type { Menu, ThemeOptions } from "@/graphql/generated/graphql";
import type { FooterLocation } from "@/lib/utilities/footerLocations";
import { MenuQuery } from "@/graphql/queries/menu";
import { query } from "@/lib/api/client";
import { normalizeContentHtml } from "@/lib/utilities/replaceDomain";

import FooterClient from "./index.client";

type MenuQueryResponse = { menu?: Menu };

export default async function Footer(
  props: ThemeOptions & { locations?: FooterLocation[] }
) {
  const { data } = await query<MenuQueryResponse>({
    query: MenuQuery,
    variables: { id: "footer-menu" },
    context: { fetchOptions: { next: { tags: ["footer-menu"], revalidate: 3600 } } },
  });
  // Normalised here rather than in FooterClient: the domain env vars are
  // server-only, so doing it client-side would differ between SSR and
  // hydration.
  const options = {
    ...props,
    copyrightSection: props.copyrightSection
      ? normalizeContentHtml(props.copyrightSection)
      : props.copyrightSection,
  };

  return <FooterClient options={options} menu={data?.menu} />;
}
