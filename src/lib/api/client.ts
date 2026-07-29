import {
  BackgroundVideoBlockFragment,
  BannerImageBlockFragment,
  BannerTextBlockFragment,
  CarouselBlockFragment,
  ExpertiseOptionsBlockFragment,
  HomePageOptionsBlockFragment,
  LocationsBlockFragment,
  PortfolioOptionsBlockFragment,
  PostsLoopBlockFragment,
  PullQuotesBlockFragment,
  SocialInfrastructureOptionsBlockFragment,
  StorySectionBlockFragment,
  TemplateOptionsBlockFragment,
  VideoBlockFragment,
} from "@/graphql/block-fragments";
import { ApolloLink, gql, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { createFragmentRegistry } from "@apollo/client/cache";
import { SetContextLink } from "@apollo/client/link/context";

import {
  AcfImageFramgent,
  ImageFramgent,
  LinkFragment,
  MenuFragment,
  NodeImageFragment,
  SeoFragment,
} from "../../graphql/fragments";
import { getBasicAuthToken, getDraftAuthToken } from "../utilities/getBasicAuthToken";
import { normalizeContentHtml } from "../utilities/replaceDomain";

if (!process.env.API_URL || process.env.API_URL.trim() === "") {
  throw new Error("API_URL is missing or empty. Please set it in .env.");
}

const httpLink = new HttpLink({
  uri: process.env.API_URL,
});

// Pass `useDraftAuth: true` in the query context to get draft/unpublished content
// (used only by getPreviewData). Regular page queries must NOT set this flag —
// it bypasses Next.js fetch caching and prevents ISR from working.
const authLink = new SetContextLink(async (prevContext) => {
  const requestHeaders = {
    ...prevContext.headers,
  };
  const token = prevContext.useDraftAuth
    ? (getDraftAuthToken() ?? getBasicAuthToken())
    : getBasicAuthToken();

  if (token) {
    requestHeaders.authorization = token;
  }
  return {
    headers: {
      ...requestHeaders,
    },
  };
});

const LOOKS_LIKE_HTML = /<[a-z][\s\S]*>/i;

/**
 * Walk a GraphQL result and rewrite backend absolute URLs inside HTML strings.
 *
 * Done at the link layer rather than per component on purpose: editor content
 * reaches the page through many block components, several of which are client
 * components where the domain env vars are not available. Normalising the data
 * once, before it reaches React, covers every consumer and keeps server and
 * client markup identical.
 *
 * Only HTML-looking strings are touched, so plain fields (uris, coordinates,
 * media URLs) are left exactly as they came back.
 */
const normalizeDeep = (value: unknown): unknown => {
  if (typeof value === "string") {
    return LOOKS_LIKE_HTML.test(value) ? normalizeContentHtml(value) : value;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeDeep);
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = normalizeDeep(item);
    }
    return result;
  }
  return value;
};

const normalizeContentLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    if (response.data) {
      response.data = normalizeDeep(response.data) as typeof response.data;
    }
    return response;
  })
);

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      fragments: createFragmentRegistry(gql`
        ${ImageFramgent}
        ${NodeImageFragment}
        ${AcfImageFramgent}
        ${SeoFragment}
        ${LinkFragment}
        ${BackgroundVideoBlockFragment}
        ${VideoBlockFragment}
        ${BannerImageBlockFragment}
        ${BannerTextBlockFragment}
        ${CarouselBlockFragment}
        ${LocationsBlockFragment}
        ${PostsLoopBlockFragment}
        ${StorySectionBlockFragment}
        ${TemplateOptionsBlockFragment}
        ${ExpertiseOptionsBlockFragment}
        ${SocialInfrastructureOptionsBlockFragment}
        ${PortfolioOptionsBlockFragment}
        ${HomePageOptionsBlockFragment}
        ${PullQuotesBlockFragment}
        ${MenuFragment}
      `),
    }),
    link: ApolloLink.from([authLink, normalizeContentLink, httpLink]),
  });
});
