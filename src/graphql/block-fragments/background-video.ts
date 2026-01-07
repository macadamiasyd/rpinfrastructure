import { gql } from "@apollo/client";

export const BackgroundVideoBlockFragment = gql`
  fragment BackgroundVideoBlockFragment on AcfBackgroundVideo {
    backgroundVideo {
      title
      subtitle
      videoFile {
        ...AcfImageFragment
      }
      videoFileMobile {
        ...AcfImageFragment
      }
      link {
        ...LinkFragment
      }
    }
  }
`;
