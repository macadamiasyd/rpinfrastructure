import type { Menu, ThemeOptions } from "@/graphql/generated/graphql";
import { MenuQuery } from "@/graphql/queries/menu";
import { query } from "@/lib/api/client";

import HeaderClient from "./index.client";

type MenuQueryResponse = {
  menu?: Menu;
};
export default async function Header(props: ThemeOptions) {
  const { data } = await query<MenuQueryResponse>({
    query: MenuQuery,
    variables: { id: "main-menu" },
  });
  return <HeaderClient options={props} menu={data?.menu} />;
}
