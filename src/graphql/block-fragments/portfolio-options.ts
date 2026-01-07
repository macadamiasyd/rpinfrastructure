import { gql } from "@apollo/client";

export const PortfolioOptionsBlockFragment = gql`
  fragment PortfolioOptionsBlockFragment on AcfPortfolioOptions {
    attributes {
      className
    }
    renderedHtml
    portfolioOptions {
      heading
      upperContent
      pullquote
      portfolioContact
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
            ... on Page {
              uri
            }
            ... on Project {
              slug
            }
          }
        }
      }
    }
  }
`;
