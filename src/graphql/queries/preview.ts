import { gql } from "@apollo/client";

export const PreviewQuery = gql`
  query PreviewQuery($id: ID!) {
    contentNode(id: $id, idType: DATABASE_ID) {
      id
      contentTypeName
      seo {
        ...SeoFragment
      }
      ... on Page {
        title
      }
    }
  }
`;
