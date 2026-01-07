import { gql } from "@apollo/client";

import { NodeImageFragment } from "../fragments";

export const SearchQuery = gql`
  query SearchQuery($term: String!, $first: Int = 24) {
    contentNodes(first: $first, where: { search: $term }) {
      nodes {
        __typename
        ... on Post {
          title
          uri
          featuredImage {
            ...NodeImageFragment
          }
        }
        ... on Project {
          title
          uri
          slug
          featuredImage {
            ...NodeImageFragment
          }
        }
        ... on Person {
          title
          uri
          slug
          featuredImage {
            ...NodeImageFragment
          }
        }
        ... on Page {
          title
          uri
          featuredImage {
            ...NodeImageFragment
          }
        }
      }
    }
  }
  ${NodeImageFragment}
`;
