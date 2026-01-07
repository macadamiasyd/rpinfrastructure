import { gql } from "@apollo/client";

import { NodeImageFragment } from "../fragments";

export const PostsLoopPostsQuery = gql`
  query PostsLoopPostsQuery(
    $first: Int!
    $categoryIn: [ID]
    $orderby: [PostObjectsConnectionOrderbyInput!]
  ) {
    posts(first: $first, where: { status: PUBLISH, categoryIn: $categoryIn, orderby: $orderby }) {
      nodes {
        id
        title
        uri
        link
        featuredImage {
          ...NodeImageFragment
        }
      }
    }
  }
  ${NodeImageFragment}
`;

export const PostsLoopProjectsRootQuery = gql`
  query PostsLoopProjectsRootQuery($first: Int!, $orderby: [PostObjectsConnectionOrderbyInput!]) {
    projects(first: $first, where: { status: PUBLISH, orderby: $orderby }) {
      nodes {
        id
        title
        uri
        link
        featuredImage {
          ...NodeImageFragment
        }
      }
    }
  }
  ${NodeImageFragment}
`;

export const PostsLoopProjectsByCategoryQuery = gql`
  query PostsLoopProjectsByCategoryQuery(
    $termId: ID!
    $first: Int!
    $orderby: [PostObjectsConnectionOrderbyInput!]
  ) {
    projectCategory(id: $termId, idType: DATABASE_ID) {
      projects(first: $first, where: { status: PUBLISH, orderby: $orderby }) {
        nodes {
          id
          title
          uri
          link
          featuredImage {
            ...NodeImageFragment
          }
        }
      }
    }
  }
  ${NodeImageFragment}
`;

export const PostsLoopProjectsByLocationQuery = gql`
  query PostsLoopProjectsByLocationQuery(
    $termId: ID!
    $first: Int!
    $orderby: [PostObjectsConnectionOrderbyInput!]
  ) {
    projectLocation(id: $termId, idType: DATABASE_ID) {
      projects(first: $first, where: { status: PUBLISH, orderby: $orderby }) {
        nodes {
          id
          title
          uri
          link
          featuredImage {
            ...NodeImageFragment
          }
        }
      }
    }
  }
  ${NodeImageFragment}
`;

export const PostsLoopProjectsByServiceQuery = gql`
  query PostsLoopProjectsByServiceQuery(
    $termId: ID!
    $first: Int!
    $orderby: [PostObjectsConnectionOrderbyInput!]
  ) {
    projectService(id: $termId, idType: DATABASE_ID) {
      projects(first: $first, where: { status: PUBLISH, orderby: $orderby }) {
        nodes {
          id
          title
          uri
          link
          featuredImage {
            ...NodeImageFragment
          }
        }
      }
    }
  }
  ${NodeImageFragment}
`;
