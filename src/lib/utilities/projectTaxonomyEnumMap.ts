export const projectTaxonomyEnumMap = {
  project_locations: "PROJECTLOCATION",
  project_services: "PROJECTSERVICE",
  project_category: "PROJECTCATEGORY",
} as const;

export type ProjectTaxonomyEnumMap = typeof projectTaxonomyEnumMap;

export type ProjectTaxonomyEnum = keyof ProjectTaxonomyEnumMap;
