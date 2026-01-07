import { gql } from "@apollo/client";

export const LinkFragment = gql`
  fragment LinkFragment on AcfLink {
    target
    title
    url
  }
`;
