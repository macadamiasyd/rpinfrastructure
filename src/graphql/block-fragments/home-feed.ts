import { gql } from "@apollo/client";

export const HomeFeedBlockFragment = gql`
  fragment HomeFeedBlockFragment on AcfHomeFeed {
    homeFeed {
      items {
        nodes {
          __typename
          ... on Post {
            title
            uri
            categories {
              nodes {
                name
              }
            }
            featuredImage {
              ...NodeImageFragment
            }
          }
          ... on Project {
            title
            uri
            featuredImage {
              ...NodeImageFragment
            }
          }
          ... on Person {
            title
            uri
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
  }
`;
