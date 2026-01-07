import { gql } from "@apollo/client";

export const BannerImageBlockFragment = gql`
  fragment BannerImageBlockFragment on AcfBannerImage {
    attributes {
      className
    }
    bannerImage {
      image {
        ...AcfImageFragment
      }
      fixedPosition
    }
  }
`;
