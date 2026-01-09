# GraphQL Setup with Authentication

## Overview

This project uses GraphQL Code Generator (Client Preset) together with Apollo Client (Next.js integration) and optional Basic Authentication for WordPress GraphQL endpoints.

## Configuration Files

- codegen: [codegen.ts](./codegen.ts)
  - Loads API_URL from environment
  - Adds Basic Auth header via getBasicAuthToken
  - Uses Client Preset to generate typed gql documents into src/graphql/generated
  - Configures custom scalars and maybeValue

- Apollo Client: [client.ts](./src/lib/api/client.ts)
  - Registers ApolloClient via Next integration (registerApolloClient)
  - HttpLink points to API_URL
  - SetContextLink attaches Basic Auth header when present
  - Registers ACF/block fragments with createFragmentRegistry
  - Exposes helpers: getClient, query, PreloadQuery

- Auth helper: [getBasicAuthToken.ts](./src/lib/utilities/getBasicAuthToken.ts)
  - Builds Basic <base64(username:password)> token from environment variables

## Environment Variables

Create `.env.local` with:

```env
# Required: GraphQL endpoint
API_URL=https://example.com/graphql

# Optional: Basic Auth credentials
BASIC_AUTH_USERNAME=username
BASIC_AUTH_PASSWORD=password

# Optional: Draft Mode (Application Passwords)
# Use WordPress Application Passwords when draft mode is enabled
DRAFT_AUTH_USERNAME=wpadmin
DRAFT_AUTH_PASSWORD=application-password

# Optional: domains for link normalization utilities
FRONTEND_DOMAIN=localhost:3000
API_DOMAIN=example.com
```

## Usage

### 1) Generate Types

```bash
npm run codegen
```

### 2) Watch Mode

```bash
npm run codegen:watch
```

### 3) Query Example (Server-side)

```ts
import { PageQuery } from "@/graphql/queries/page";
import { query } from "@/lib/api/client";

const { data } = await query({
  query: PageQuery,
  variables: { slug: "/about/" },
});
```

You can also pass Next.js cache options via `context.fetchOptions`:

```ts
await query({
  query: PageQuery,
  variables: { slug: "/about/" },
  context: { fetchOptions: { next: { tags: ["page:/about/"], revalidate: 3600 } } },
});
```

### 4) Using Generated Documents

- Import the gql documents directly from your query files (they are typed via Client Preset).
- Import utilities like `gql` or fragments from `src/graphql/generated` as needed.

## Features

- Client Preset: modern GraphQL development with typed documents
- Basic Authentication: secure access to protected GraphQL endpoints
- Application Passwords: recommended for remote requests (WordPress 5.6+)
- Apollo Client: Next.js integration and fragment registry
- TypeScript: strong typing for queries and responses
- Environment Variables: flexible configuration across environments

## Generated Files

- src/graphql/generated/ — Generated types/utilities
- src/graphql/generated/gql.ts — Typed gql tag
- src/graphql/generated/graphql.ts — TypeScript types for schema/entities

## References

- Application Passwords: Integration Guide — https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/
- WPGraphQL Authentication & Authorization — https://www.wpgraphql.com/docs/authentication-and-authorization
