import { gql } from "@apollo/client";

import { NodeImageFragment } from "../fragments";
import type { RootQueryToPersonConnection } from "../generated/graphql";

export type PeopleListQueryResult = {
  people?: RootQueryToPersonConnection;
};

export const PeopleListQuery = gql`
  query PeopleListQuery(
    $first: Int!
    $after: String
    $orderby: [PostObjectsConnectionOrderbyInput]
  ) {
    people(first: $first, after: $after, where: { status: PUBLISH, orderby: $orderby }) {
      nodes {
        id
        title
        slug
        uri
        link
        content
        featuredImage {
          ...NodeImageFragment
        }
        personFields {
          position
          email
          phone
          linkedinUrl
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
