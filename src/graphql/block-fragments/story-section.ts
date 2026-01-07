import { gql } from "@apollo/client";

export const StorySectionBlockFragment = gql`
  fragment StorySectionBlockFragment on AcfStorySection {
    attributes {
      className
    }
    storySection {
      title
      subtitle
      content
      quote
      images(first: 1) {
        edges {
          ...AcfImageFragment
        }
      }
      reverseLayout
    }
  }
`;
