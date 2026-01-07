import { gql } from "@apollo/client";

export const CarouselBlockFragment = gql`
  fragment CarouselBlockFragment on AcfCarousel {
    attributes {
      className
    }
    carousel {
      slides {
        image {
          ...AcfImageFragment
        }
        title
        caption
        ctaLabel
        linkToProject
        link(first: 1) {
          nodes {
            __typename
            ... on ContentNode {
              uri
            }
            ... on Project {
              slug
              uri
            }
          }
        }
      }
    }
  }
`;
