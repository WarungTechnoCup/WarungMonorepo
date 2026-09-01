# ADR 0001: Stack and repository foundation

- Status: Accepted
- Date: 2026-09-01
- Decision owners: Three-person Warung Cek Harga team

## Context

The competition evaluates functionality, UI/UX, technology, security, repository quality, documentation, and live presentation. Three contributors need clear feature ownership, reviewable database changes, and a build that works before external services exist.

## Decision

Use Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4. Use Supabase PostgreSQL, cookie-based Auth, and private Storage behind server access boundaries. Use Drizzle ORM with versioned SQL migrations and the transaction pooler with prepared statements disabled. Use pnpm 11.19.0 on Node.js 24, Vitest, Playwright, ESLint, and Prettier.

Keep the competition repository in its own folder and keep the official PDF outside Git. Commit the developer specification, requirement extraction, contributor guidance, and progress evidence. Use an MIT license and feature slices named Discover, Contribute, and Act.

## Consequences

Public routes and builds must work without Supabase credentials. Protected routes fail closed until cookie auth is configured. Domain tables, remote services, deployments, and business behavior remain pending. Replacing a selected framework, ORM, auth provider, database, test tool, or package manager requires a superseding ADR and team approval.
