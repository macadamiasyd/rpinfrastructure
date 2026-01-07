# RP Infrastructure Rebuild

Modern headless WordPress + Next.js solution with GraphQL integration and authentication support.

## Tech Stack

- **Framework**: Next.js 16 + App Router + TypeScript + Turbopack
- **API**: GraphQL + GraphQL Code Generator (Client Preset)
- **GraphQL Client**: TanStack Query + graphql-request
- **Authentication**: Basic Auth support for GraphQL endpoints
- **Code Quality**: ESLint + Prettier + Husky + lint-staged
- **Styling**: CSS Modules
- **Node.js**: 24.11.0 (see .nvmrc)

## Getting Started

### Prerequisites

- Node.js 24.11.0 (use `nvm use` if you have nvm installed)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```env
# API Endpoints
API_URL=https://example.com/graphql

# Site URL
SITE_URL=https://example.com

# Authentication
BASIC_AUTH_USERNAME=username
BASIC_AUTH_PASSWORD=password
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### GraphQL Code Generation

Generate TypeScript types and hooks from your GraphQL schema:

```bash
npm run codegen          # One-time generation
npm run codegen:watch    # Watch mode
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Check TypeScript types
- `npm run codegen` - Generate GraphQL types and hooks
- `npm run codegen:watch` - Watch GraphQL files and regenerate

## Code Quality

This project uses:

- **ESLint** with Next.js and TypeScript rules
- **Prettier** with import sorting (@ianvs/prettier-plugin-sort-imports)
- **Husky** for git hooks
- **lint-staged** for running linters on staged files only
- **TypeScript** for type safety

Pre-commit hooks automatically run linting and formatting on staged files.

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── graphql/          # GraphQL queries and generated files
│   │   ├── queries/      # GraphQL queries (TypeScript)
│   │   ├── mutations/    # GraphQL mutations
│   │   ├── fragments/    # GraphQL fragments
│   │   └── generated/    # Auto-generated types and hooks
│   ├── lib/              # Libraries and clients
│   │   └── graphql-client.ts  # GraphQL client configuration
│   ├── providers/        # React providers
│   │   └── query-client-provider.tsx  # TanStack Query setup
│   └── utilities/        # Utility functions
│       └── getBasicAuthToken.ts  # Authentication utilities
├── public/               # Static assets
├── .husky/               # Git hooks
├── codegen.config.ts     # GraphQL Code Generator configuration
├── .nvmrc                # Node.js version
└── lint-staged.config.mjs  # lint-staged configuration
```

## GraphQL Integration

This project uses **GraphQL Code Generator** with **Client Preset** for modern GraphQL development:

### Features

- ✅ **TypeScript Code Generation** - Automatic type generation from GraphQL schema
- ✅ **TanStack Query Integration** - Optimized data fetching with caching
- ✅ **Basic Authentication** - Support for protected GraphQL endpoints
- ✅ **Client Preset** - Modern approach with `gql` tag function
- ✅ **Watch Mode** - Automatic regeneration on schema changes

### Usage Example

```typescript
import { gql } from "@/graphql/generated";
import { graphqlClient } from "@/lib/graphql-client";
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

For detailed GraphQL setup instructions, see [GRAPHQL_SETUP.md](./GRAPHQL_SETUP.md).
