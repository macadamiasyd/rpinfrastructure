import { gql } from "@apollo/client";

export const OurPurposesAndValuesBlockFragment = gql`
  fragment OurPurposesAndValuesBlockFragment on AcfOurPurposeAndValues {
    attributes {
      className
    }
    ourPurposesAndValues {
      heading
      upperContent
      ourPurposeHeading
      purposeImage {
        ...AcfImageFragment
      }
      purposeList {
        title
        content
      }
      ourValuesHeading
    }
  }
`;
