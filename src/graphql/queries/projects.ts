import { gql } from "@apollo/client";

import { NodeImageFragment } from "../fragments";

export const ProjectCategoriesQuery = gql`
  query ProjectCategoriesQuery {
    projectCategories(first: 999) {
      nodes {
        databaseId
        slug
        name
        uri
      }
    }
  }
`;

export const ProjectCategoriesWithChildrenQuery = gql`
  query ProjectCategoriesWithChildrenQuery {
    projectCategories(first: 999) {
      nodes {
        databaseId
        name
        uri
        children {
          nodes {
            databaseId
            slug
            name
            uri
          }
        }
      }
    }
  }
`;

export const ProjectsRootQuery = gql`
  query ProjectsRootQuery(
    $first: Int!
    $after: String
    $orderby: [PostObjectsConnectionOrderbyInput!]
  ) {
    projects(first: $first, after: $after, where: { status: PUBLISH, orderby: $orderby }) {
      nodes {
        id
        title
        uri
        link
        slug
        dateGmt
        featuredImage {
          ...NodeImageFragment
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${NodeImageFragment}
`;

export const ProjectsByCategoryQuery = gql`
  query ProjectsByCategoryQuery(
    $slug: ID!
    $first: Int!
    $after: String
    $orderby: [PostObjectsConnectionOrderbyInput!]
  ) {
    projectCategory(id: $slug, idType: SLUG) {
      projects(first: $first, after: $after, where: { status: PUBLISH, orderby: $orderby }) {
        nodes {
          id
          title
          uri
          link
          dateGmt
          slug
          featuredImage {
            ...NodeImageFragment
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${NodeImageFragment}
`;

export const ProjectQuery = gql`
  query ProjectQuery($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
      __typename
      title
      content
      slug
      databaseId
      seo {
        ...SeoFragment
      }
      featuredImage {
        ...NodeImageFragment
      }
      carousel {
        slides {
          image {
            ...AcfImageFragment
          }
        }
      }
      projectFields {
        subtitle
        value
        completion
        client
      }
      projectCategories(first: 50) {
        nodes {
          __typename
          name
          slug
          uri
          link
        }
      }
      projectServices(first: 50) {
        nodes {
          __typename
          name
          slug
          uri
          link
        }
      }
      projectLocations(first: 50) {
        nodes {
          __typename
          name
          slug
          uri
          link
        }
      }
    }
  }
`;

export const ProjectSeoQuery = gql`
  query ProjectSeoQuery($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
      __typename
      seo {
        ...SeoFragment
      }
    }
  }
`;

export const ProjectLocationQuery = gql`
  query ProjectLocationQuery($slug: ID!) {
    projectLocation(id: $slug, idType: SLUG) {
      name
      slug
      databaseId
      description
      seo {
        ...TaxonomySeoFragment
      }
    }
  }
`;

export const ProjectSectorQuery = gql`
  query ProjectSectorQuery($slug: ID!) {
    projectCategory(id: $slug, idType: SLUG) {
      name
      slug
      databaseId
      description
      seo {
        ...TaxonomySeoFragment
      }
    }
  }
`;

export const ProjectServiceQuery = gql`
  query ProjectServiceQuery($slug: ID!) {
    projectService(id: $slug, idType: SLUG) {
      name
      slug
      databaseId
      description
      seo {
        ...TaxonomySeoFragment
      }
    }
  }
`;

export const ProjectsArchiveQuery = gql`
  query ProjectsArchiveQuery($first: Int = 12, $taxQuery: TaxQuery, $after: String, $notIn: ID) {
    projects(
      first: $first
      after: $after
      where: { taxQuery: $taxQuery, orderby: { field: DATE, order: DESC }, notIn: [$notIn] }
    ) {
      nodes {
        id
        title
        uri
        link
        slug
        dateGmt
        featuredImage {
          ...NodeImageFragment
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const ProjectTaxonomiesQuery = gql`
  query ProjectTaxonomiesQuery {
    projectServices(first: 999, where: { parent: 0 }) {
      nodes {
        databaseId
        name
        slug
        taxonomy {
          node {
            name
            label
          }
        }
      }
    }
    projectCategories(first: 999, where: { parent: 0 }) {
      __typename
      nodes {
        databaseId
        name
        slug
        count
        children {
          nodes {
            databaseId
            name
            slug
            count
          }
        }
        taxonomy {
          node {
            name
            label
          }
        }
      }
    }
    projectLocations(first: 999, where: { parent: 0 }) {
      nodes {
        databaseId
        name
        slug
        children {
          nodes {
            databaseId
            name
            slug
          }
        }
        taxonomy {
          node {
            name
            label
          }
        }
      }
    }
  }
`;

export const ProjectsSitemapQuery = gql`
  query ProjectsSitemapQuery {
    projects(first: 999, where: { status: PUBLISH }) {
      nodes {
        id
        slug
      }
    }
  }
`;

/**
 * Every sector slug, parents and sub-sectors alike — both have a landing page.
 * Deliberately not filtered by `parent`, unlike ProjectTaxonomiesQuery.
 */
export const ProjectSectorsSitemapQuery = gql`
  query ProjectSectorsSitemapQuery {
    projectCategories(first: 999) {
      nodes {
        id
        slug
      }
    }
  }
`;

/** Locations are hierarchical too (states under Australia) — take every level. */
export const ProjectLocationsSitemapQuery = gql`
  query ProjectLocationsSitemapQuery {
    projectLocations(first: 999) {
      nodes {
        id
        slug
      }
    }
  }
`;

export const ProjectServicesSitemapQuery = gql`
  query ProjectServicesSitemapQuery {
    projectServices(first: 999) {
      nodes {
        id
        slug
      }
    }
  }
`;
