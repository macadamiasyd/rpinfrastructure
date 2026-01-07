import { gql } from "@apollo/client";

export const ExpertiseOptionsBlockFragment = gql`
  fragment ExpertiseOptionsBlockFragment on AcfExpertiseOptions {
    attributes {
      className
    }
    expertiseOptions {
      heading
      upperContent
      isCollapsible
      twoColumnsLayout
      expertiseList {
        title
        content
        buttonLabel
        buttonLink
        image {
          ...AcfImageFragment
        }
      }
    }
  }
`;
