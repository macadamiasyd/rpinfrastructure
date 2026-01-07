import { gql } from "@apollo/client";

export const TemplateOptionsBlockFragment = gql`
  fragment TemplateOptionsBlockFragment on AcfTemplateOptions {
    attributes {
      className
    }
    templateOptions {
      heading
      subheading
      content
      image {
        ...AcfImageFragment
      }
      imageList {
        img {
          ...AcfImageFragment
        }
      }
    }
  }
`;
