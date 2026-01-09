# RP Infrastructure

Modern headless WordPress + Next.js app with GraphQL integration.

## Tech Stack

- Framework: Next.js 16 (App Router) + TypeScript
- GraphQL: WPGraphQL + ACF, Apollo Client (Next integration)
- Codegen: GraphQL Code Generator (client preset) → types/utilities in `src/graphql/generated`
- Styling: Sass (SCSS) + custom styles
- UI/UX: Swiper for carousels
- Code Quality: ESLint + Prettier + Husky + lint-staged

## Quick Start

- Install dependencies:

```bash
npm install
```

- Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` and set:

```env
# Required: GraphQL endpoint
API_URL=https://example.com/graphql

# Optional: Basic Auth for protected endpoints
BASIC_AUTH_USERNAME=username
BASIC_AUTH_PASSWORD=password

# Optional: Draft Mode Basic Auth (WordPress Application Passwords)
DRAFT_AUTH_USERNAME=wpadmin
DRAFT_AUTH_PASSWORD=application-password
PREVIEW_SECRET_TOKEN=secret-token

# Domains for link normalization (replaceDomain / normalizeAppHref)
# FRONTEND_DOMAIN — the frontend host (e.g. localhost:3000 or prod host)
# API_DOMAIN — the source WordPress site host (without protocol)
FRONTEND_DOMAIN=localhost:3000
API_DOMAIN=example.com
```

## Scripts

- `npm run dev` — Development server
- `npm run build` — Build
- `npm run start` — Production server
- `npm run lint` — ESLint
- `npm run lint:fix` — Fix ESLint issues
- `npm run format` — Prettier format
- `npm run format:check` — Check formatting
- `npm run type-check` — TypeScript check
- `npm run codegen` — GraphQL types/utilities generation
- `npm run codegen:watch` — Codegen watch mode

## GraphQL Integration

- Apollo Client is configured via Next integration: [client.ts](./src/lib/api/client.ts)
  - Uses `registerApolloClient`, `HttpLink`, and `SetContextLink` for Basic Auth headers.
  - ACF/block fragments are registered via `createFragmentRegistry`.

Server-side query example:

```ts
import { PageQuery } from "@/graphql/queries/page";
import { query } from "@/lib/api/client";

const { data } = await query({ query: PageQuery, variables: { slug: "/about/" } });
```

Codegen is configured in [codegen.ts](./codegen.ts) and outputs to `src/graphql/generated/`.

For detailed setup and configuration, see [GRAPHQL_SETUP.md](./GRAPHQL_SETUP.md).

## Preview Mode

- Enable preview (draft mode) via:
  - `GET /api/preview?post_id=<ID>&secret_token=<PREVIEW_SECRET_TOKEN>`
  - Requires `PREVIEW_SECRET_TOKEN` in env
  - Redirects to `/preview` which renders post/page/project by `post_id`
- Exit preview via:
  - `GET /api/exit-preview`
- Server-side requests in draft mode use Draft Basic Auth:
  - `DRAFT_AUTH_USERNAME` / `DRAFT_AUTH_PASSWORD`
- Relevant files:
  - API routes: [`src/app/api/preview/route.ts`](./src/app/api/preview/route.ts), [`src/app/api/exit-preview/route.ts`](./src/app/api/exit-preview/route.ts)
  - Preview page: [`src/app/preview/page.tsx`](./src/app/preview/page.tsx)
  - Data fetch: [`src/lib/utilities/getPreviewData.ts`](./src/lib/utilities/getPreviewData.ts)
  - Apollo client/auth: [`src/lib/api/client.ts`](./src/lib/api/client.ts)

## Project Structure

```
├── src/
  ├── app/                      # Next.js App Router pages
  │   ├── project/[slug]/       # Project details page
  │   ├── portfolio/            # Projects archive page
  │   ├── news/                 # News archive pages
  │   ├── search/               # Search page
  │   ├── locations/            # Locations pages
  │   ├── sectors/              # Sector pages
  │   ├── people/               # People page
  │   ├── preview/              # Preview page
  │   ├── layout.tsx            # Root layout
  │   └── page.tsx              # Home page
  ├── components/               # UI components
  │   ├── blocks/               # ACF block components
  │   ├── projects-carousel/    # Swiper projects carousel
  │   ├── post-carousel/        # Post/Project carousel
  │   ├── projects-filter/      # Projects filter
  │   ├── projects-filter-archive/ # Filtered archive
  │   ├── projects-listing/     # Projects listing grid
  │   ├── cards/                # Card components
  │   └── shared/               # Shared UI (icons, media, navigation)
  ├── graphql/                  # GraphQL queries and generated files
  │   ├── block-fragments/      # ACF block fragments (gql)
  │   ├── fragments/            # Common fragments (image, seo, link)
  │   ├── queries/              # GraphQL queries (gql)
  │   └── generated/            # Auto-generated types and utilities
  ├── lib/                      # Libraries and clients
  │   ├── api/                  # Apollo Client setup
  │   └── utilities/            # sanitizeHtml, replaceDomain, queryProjects, etc.
  ├── styles/                   # SCSS styles
  └── fonts/                    # Web fonts
```

## Navigation and Filters

- Filter persistence across related project navigation and archive:
  - Related Projects pass `hrefQuery` so returning to the archive restores the original filters.
  - Back to projects on the project page respects current URL and referer:
    - If filters are in the current URL → return to `/portfolio` with those filters.
    - If arrived from `/portfolio` → return to that page with original query.
    - If arrived from `/project` without filters → return to clean `/portfolio`.
  - Term links on the project page navigate to:
    - Category → `/portfolio?category=<slug>`
    - Service → `/portfolio?service=<slug>`
    - Location → `/portfolio?location=<slug>`

## Notes

- Set `FRONTEND_DOMAIN` and `API_DOMAIN` for correct link domain replacement.
- Set `BASIC_AUTH_USERNAME`/`BASIC_AUTH_PASSWORD` if the GraphQL endpoint requires Basic Auth.
