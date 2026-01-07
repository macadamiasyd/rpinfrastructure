# GraphQL Setup with Authentication

## Overview

This project uses **GraphQL Code Generator** with **Client Preset** and **Basic Authentication** support for WordPress GraphQL endpoints.

## Configuration Files

### `codegen.ts`

Advanced TypeScript configuration with:

- Basic Authentication support
- Environment variables
- Client preset for modern GraphQL usage

### `src/utilities/getBasicAuthToken.ts`

Utility function for generating Basic Auth tokens from environment variables.

## Environment Variables

Create `.env.local` file with:

```env
# API Endpoints
API_URL=https://example.com/graphql

# Site URL
SITE_URL=https://example.com

# Authentication
BASIC_AUTH_USERNAME=username
BASIC_AUTH_PASSWORD=password
```

## Usage

### 1. Generate Types and Hooks

```bash
npm run codegen
```

### 2. Watch Mode

```bash
npm run codegen:watch
```

### 3. Using Generated Code

```typescript
import { gql } from "@/graphql/generated";
import { useQuery } from "@tanstack/react-query";

const GET_POSTS = gql(`
  query GetPosts {
    posts {
      nodes {
        id
        title
        slug
      }
    }
  }
`);

// In component
const { data, isLoading } = useQuery({
  queryKey: ["posts"],
  queryFn: () => graphqlClient.request(GET_POSTS),
});
```

## Features

- ✅ **Client Preset**: Modern GraphQL Code Generator approach
- ✅ **Basic Authentication**: Secure WordPress GraphQL access
- ✅ **TypeScript**: Full type safety
- ✅ **TanStack Query**: Optimized data fetching
- ✅ **Environment Variables**: Flexible configuration

## Generated Files

- `src/graphql/generated/` - All generated types and utilities
- `src/graphql/generated/gql.ts` - GraphQL tag function
- `src/graphql/generated/graphql.ts` - TypeScript types
