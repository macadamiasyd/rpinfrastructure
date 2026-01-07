import { gql } from "@apollo/client";

export const MenuFragment = gql`
  fragment MenuFragment on Menu {
    id
    name
    menuItems(first: 100) {
      nodes {
        uri
        label
        target
        cssClasses
        id
        parentId
      }
    }
  }
`;
