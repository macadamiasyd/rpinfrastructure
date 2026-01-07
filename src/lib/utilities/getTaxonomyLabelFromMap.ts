export const taxonomyLabelFromMap = {
  project_locations: "Locations",
  project_services: "Services",
  project_category: "Sectors",
} as const;

export type TaxonomyLabelFromMap = typeof taxonomyLabelFromMap;

export type TaxonomyLabelFromMapKey = keyof TaxonomyLabelFromMap;
