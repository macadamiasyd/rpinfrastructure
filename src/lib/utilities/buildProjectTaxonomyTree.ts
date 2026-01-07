import type { ProjectCategory, ProjectLocation, ProjectService } from "@/graphql/generated/graphql";

import { taxonomyLabelFromMap, type TaxonomyLabelFromMapKey } from "./getTaxonomyLabelFromMap";

type AnyProjectNode = ProjectCategory | ProjectLocation | ProjectService;

type ProjectTaxonomyTreeResult = {
  taxonomy: string;
  taxonomyLabel: string;
  nodes: AnyProjectNode[];
};

export const buildProjectTaxonomyTree = (nodes: AnyProjectNode[]): ProjectTaxonomyTreeResult => {
  const group: ProjectTaxonomyTreeResult = {
    nodes: nodes,
    taxonomy: "",
    taxonomyLabel: "",
  };

  if (!nodes || nodes.length === 0) return group;
  const taxonomyNode = nodes.find(
    (node) => "taxonomy" in node && node.taxonomy && node.taxonomy.node
  );
  group.taxonomy = taxonomyNode?.taxonomy?.node?.name ?? "";
  group.taxonomyLabel = taxonomyNode?.taxonomy?.node?.name
    ? taxonomyLabelFromMap[taxonomyNode.taxonomy.node.name as TaxonomyLabelFromMapKey]
    : "";

  return group;
};
