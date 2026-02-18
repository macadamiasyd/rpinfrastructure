import { gql } from "@apollo/client";

export const ReadingSettingsQuery = gql`
  query ReadingSettingsQuery {
    readingSettings {
      pageForPosts
      pageOnFront
      postsPerPage
    }
  }
`;
