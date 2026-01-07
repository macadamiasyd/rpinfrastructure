import type { MenuItem } from "@/graphql/generated/graphql";

interface MenuItemWithIndexSignature extends MenuItem {
  [key: string]: unknown;
}
export const flatMenuToHierarchical = (
  data: MenuItemWithIndexSignature[] = [],
  { idKey = "id", parentKey = "parentId", childrenKey = "children" } = {}
) => {
  const tree: MenuItemWithIndexSignature[] = [];
  const childrenOf: { [key: string]: MenuItemWithIndexSignature[] } = {};
  data.forEach((item) => {
    const newItem: MenuItemWithIndexSignature = { ...item };
    const {
      [idKey as keyof MenuItemWithIndexSignature]: id,
      [parentKey as keyof MenuItemWithIndexSignature]: parentId = 0,
    } = newItem as Record<string, string>;
    childrenOf[id] = childrenOf[id] || [];
    newItem[childrenKey] = childrenOf[id];
    parentId
      ? (childrenOf[parentId] = childrenOf[parentId] || []).push(newItem)
      : tree.push(newItem);
  });
  return tree;
};
