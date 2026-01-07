import { gql } from "@apollo/client";

export const PullQuotesBlockFragment = gql`
  fragment PullQuotesBlockFragment on AcfPullQuotes {
    pullQuotes {
      quotes {
        quote
        link {
          url
          title
          target
        }
      }
    }
  }
`;
