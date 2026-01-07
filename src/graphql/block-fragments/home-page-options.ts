import { gql } from "@apollo/client";

export const HomePageOptionsBlockFragment = gql`
  fragment HomePageOptionsBlockFragment on AcfHomePageOptions {
    homePageOptions {
      homePageHeading
    }
  }
`;
