import { gql } from "@apollo/client";

export const VideoBlockFragment = gql`
  fragment VideoBlockFragment on AcfVideo {
    videoBlock {
      url
    }
  }
`;
