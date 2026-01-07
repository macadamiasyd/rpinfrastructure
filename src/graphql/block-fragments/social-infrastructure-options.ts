import { gql } from "@apollo/client";

export const SocialInfrastructureOptionsBlockFragment = gql`
  fragment SocialInfrastructureOptionsBlockFragment on AcfSocialInfrastructureOptions {
    attributes {
      className
    }
    socialInfrastructureOptions {
      heading
      infrastructureList {
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
