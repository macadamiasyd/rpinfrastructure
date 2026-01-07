import { gql } from "@apollo/client";

export const MenuQuery = gql`
  query MenuQuery($id: ID!) {
    menu(id: $id, idType: LOCATION) {
      id
      __typename
      ...MenuFragment
    }
  }
`;
