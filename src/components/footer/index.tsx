import type { Menu, ThemeOptions } from "@/graphql/generated/graphql";
import type { FooterLocation } from "@/lib/utilities/footerLocations";
import { MenuQuery } from "@/graphql/queries/menu";
import { query } from "@/lib/api/client";

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
  return <FooterClient options={props} menu={data?.menu} />;
}
