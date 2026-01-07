import { gql } from "@apollo/client";

export const PostsLoopBlockFragment = gql`
  fragment PostsLoopBlockFragment on AcfPostsLoop {
    attributes {
      className
    }
    bloc {
      title
      postsPerPage
      offset
      order
      orderby
      postType
      categories(first: 50) {
        nodes {
          __typename
          databaseId
          slug
          name
          uri
        }
      }
      projectCategories(first: 50) {
        nodes {
          __typename
          databaseId
          slug
          name
          uri
        }
      }
      projectLocations(first: 50) {
        nodes {
          __typename
          databaseId
          slug
          name
          uri
        }
      }
      projectServices(first: 50) {
        nodes {
          __typename
          databaseId
          slug
          name
          uri
        }
      }
    }
  }
`;
