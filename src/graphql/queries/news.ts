import { gql } from "@apollo/client";

export const PostQuery = gql`
  query PostQuery($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      __typename
      title
      content
      slug
      seo {
        ...SeoFragment
      }
      featuredImage {
        ...NodeImageFragment
      }
      carousel {
        slides {
          image {
            ...AcfImageFragment
          }
        }
      }
    }
  }
`;

export const PostSeoQuery = gql`
  query PostSeoQuery($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      __typename
      seo {
        ...SeoFragment
      }
    }
  }
`;

export const PostsQuery = gql`
  query PostsQuery(
    $first: Int = 10
    $after: String
    $year: Int
    $month: Int
    $day: Int
    $categoryIn: [ID]
  ) {
    posts(
      first: $first
      after: $after
      where: {
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
        dateQuery: { year: $year, month: $month, day: $day }
        categoryIn: $categoryIn
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        uri
        excerpt
        title
        dateGmt
        databaseId
        featuredImage {
          ...NodeImageFragment
        }
      }
    }
  }
`;

export const NewsSitemapQuery = gql`
  query NewsSitemapQuery {
    posts(first: 999, where: { status: PUBLISH }) {
      nodes {
        id
        uri
        modifiedGmt
      }
    }
  }
`;

export const NewsYearsQuery = gql`
  query NewsYearsQuery {
    postYears
  }
`;

export const PostCategoriesQuery = gql`
  query PostCategoriesQuery {
    categories(
      first: 999
      # hideEmpty keeps drained categories (e.g. Uncategorized) out of the
      # news filter — they were showing as empty options.
      where: { parent: 0, orderby: TERM_ORDER, order: ASC, hideEmpty: true }
    ) {
      nodes {
        databaseId
        name
        slug
        children {
          nodes {
            databaseId
            name
            slug
          }
        }
        taxonomy {
          node {
            name
            label
          }
        }
      }
    }
  }
`;

export const BlogArchivePageSeoQuery = gql`
  query PageSeoQuery($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      __typename
      id
      seo {
        ...SeoFragment
      }
    }
  }
`;
