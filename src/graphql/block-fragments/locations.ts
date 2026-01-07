import { gql } from "@apollo/client";

export const LocationsBlockFragment = gql`
  fragment LocationsBlockFragment on AcfLocations {
    attributes {
      className
    }
    locations {
      locations {
        city
        address
        email
        location
        mapZoom
      }
    }
  }
`;
