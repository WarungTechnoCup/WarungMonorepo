# Architecture

## Product boundary

Warung Cek Harga turns verified community price observations into a privacy-preserving benchmark and then into coordinated purchasing options. Harga Wajar, verified contribution, and Kulakan Bareng form the MVP. Warung Pulse remains roadmap. Passport remains a constrained preview.

## Runtime

```text
Browser
  -> Next.js App Router and Server Components
  -> server validation and access boundary
  -> Supabase Auth, PostgreSQL, and private Storage
  -> Drizzle schema and versioned SQL migrations
```

Public, authenticated, and admin routes remain explicit. `src/proxy.ts` refreshes cookie-based sessions and fails closed for `/lapor-harga`, `/aktivitas`, `/passport`, and `/admin`. Missing configuration redirects to an actionable Bahasa Indonesia message. Public routes and builds do not require external credentials.

## Feature slices

- **Discover:** catalog, search, benchmark, product detail, methodology.
- **Contribute:** auth, price report, normalization, trust, activity, Passport preview.
- **Act:** group buying, commitments, integration, and demo readiness.

Each slice exposes a public interface. A slice must not import another slice's internals. Cross-slice orchestration belongs in an application service or route boundary.

## Domain boundaries

- `catalog`: canonical product and package identity.
- `price-report`: a private observation with source metadata and consent.
- `normalization`: pure unit and package conversion.
- `trust`: pure confidence inputs plus reviewed policy.
- `benchmark`: privacy-safe aggregate based on independent contributors.
- `buying`: opportunities, interest, commitments, and supplier quotes.
- `consent`: purpose-specific grants and withdrawals.
- `passport`: restricted derived summaries, never a public profile.

Supplier quotes must never be included in community benchmark calculations. Normalization and confidence calculations stay deterministic and side-effect free.

## Kontrak lingkungan

`.env.example` is the complete contract. Environment parsing is lazy so public builds work without Supabase. Protected operations throw `ConfigurationError` with an actionable message.

| Variable                               | Scope  | Purpose                                                            |
| -------------------------------------- | ------ | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`                  | Public | Canonical application URL                                          |
| `NEXT_PUBLIC_SUPABASE_URL`             | Public | Supabase project URL                                               |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Browser-safe publishable key                                       |
| `DATABASE_URL`                         | Server | Supabase transaction pooler URL                                    |
| `SUPABASE_STORAGE_BUCKET`              | Server | Private receipt bucket name                                        |
| `DEMO_MODE`                            | Server | Explicit local demonstration mode, never production access control |

Do not add a service-role key to browser-prefixed variables. Secrets must remain outside Git.

## Data dan migrasi

`src/db/schema.ts` now defines the first Harga Wajar domain tables: warungs, products, packaging options, reports, normalized observations, benchmarks, consents, receipt metadata, and audit events. `src/db/client.ts` uses one lazy, process-level client through the Supabase transaction pooler with prepared statements disabled. Drizzle writes reviewable SQL to `drizzle/`.

Migration `0000_spotty_surge.sql` establishes Harga Wajar and its RLS boundaries. Migration `0001_true_hannibal_king.sql` adds Kulakan Bareng tables, constraints, and policies. Migration `0002_receipt_storage.sql` creates the private receipt bucket and owner-scoped storage policies. A database constraint prevents median and range publication below five independent warungs.

Schema changes require:

1. team coordination for shared indexes;
2. an update to the Drizzle schema;
3. `pnpm db:generate` and review of generated SQL;
4. tests for constraints, ownership, and row-level security;
5. an architecture and progress update.

Applied migrations are append-only. Seed data is synthetic and labeled as demo data.

## Kontrak API

Successful responses use `ApiSuccess<T>` with `data` and optional `meta`. Failures use `ApiFailure` with a stable `code`, Bahasa Indonesia `message`, optional field errors, and a request ID. Public response fields must be allowlisted.

`GET /api/health` returns version and boolean configuration status. It never returns URLs, keys, connection strings, bucket contents, or environment values.

Harga Wajar exposes public product and benchmark reads plus authenticated normalization preview, idempotent report submission, and owner activity reads. Public benchmark responses are a discriminated union: `insufficient` never contains price statistics, while `available` contains only aggregate median, interquartile range, counts, recency, confidence, and calculation version.

Report submission validates with Zod, resolves the canonical package, normalizes landed cost, detects duplicates and IQR anomalies, persists consent and an audit event, and recomputes the scoped benchmark in one database transaction. A contributor can withdraw aggregation consent from activity, which excludes their observation and recomputes the affected benchmark. Database records remain the only data source for the UI.

## Storage and privacy

Receipt storage uses the private `receipts` bucket, owner-scoped object paths, explicit retention, MIME and size validation, and server-side authorization. Passport data receives the same sensitive-data treatment.

## Offline behavior

The manifest and `/offline` route exist. Service-worker caching is pending because session, receipt, Passport, and cross-user response rules must be classified first.

## Deployment

Vercel is the planned hosting target. The Supabase development environment is migrated and seeded. A separate production environment and public deployment URL remain release gates.
