# Progress

Status values: `Complete`, `In progress`, `Pending`, and `Blocked`.

| Work item                                     | Status   | Owner       | Branch or PR | Evidence                                             | Blocker                             | Next                                              |
| --------------------------------------------- | -------- | ----------- | ------------ | ---------------------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| Guidebook and specification analysis          | Complete | Integration | `main`       | `docs/competition-requirements.md` and source hashes | None                                | Maintain tracker through submission               |
| Stack and repository decisions                | Complete | Integration | `main`       | ADR 0001                                             | None                                | Add ADRs for future changes                       |
| Local Git repository                          | Complete | Integration | `main`       | Atomic scaffold commits, no remote                   | Private organization not created    | Add remote when organization exists               |
| Route shells and mobile design foundation     | Complete | Discover    | `main`       | App Router pages and Playwright route matrix         | None                                | Replace shells only with tested features          |
| Environment and API contracts                 | Complete | Integration | `main`       | `.env.example`, Zod parser, `/api/health`            | Supabase resources not created      | Configure development project later               |
| Supabase and Drizzle adapters                 | Complete | Integration | `main`       | Client factories, proxy, Drizzle config              | Database not provisioned            | Introduce schema with RLS in next milestone       |
| Testing and quality gates                     | Complete | Integration | `main`       | Vitest, Playwright, ESLint, Prettier, CI             | None                                | Expand state and access coverage with features    |
| Contributor rules and project documentation   | Complete | Integration | `main`       | `AGENTS.md`, `CONTRIBUTING.md`, docs                 | GitHub handles unknown              | Add CODEOWNERS later                              |
| Supabase development and production resources | Pending  | Contribute  | Not started  | None                                                 | Project ownership and credentials   | Create separate environments                      |
| Domain database and row-level security        | Pending  | Contribute  | Not started  | Empty schema entrypoint                              | Domain review required              | Model catalog, reports, consent, and trust        |
| Email and password authentication UI          | Pending  | Contribute  | Not started  | Route shell only                                     | Supabase Auth not configured        | Build sign-in and demo account flow               |
| Harga Wajar benchmark logic                   | Pending  | Discover    | Not started  | Methodology draft only                               | Domain data absent                  | Implement pure normalization and threshold states |
| Verified price contribution and receipts      | Pending  | Contribute  | Not started  | Route shell only                                     | Storage policies absent             | Design server validation and private uploads      |
| Kulakan Bareng                                | Pending  | Act         | Not started  | Route shells only                                    | Benchmark and identity dependencies | Model opportunities and commitments               |
| Passport behavior                             | Pending  | Contribute  | Not started  | Constrained preview shell                            | Consent model absent                | Review scope and privacy before implementation    |
| Deployment and uptime plan                    | Pending  | Act         | Not started  | Vercel assumption documented                         | Remote resources absent             | Add preview and production environments           |
| Screenshots and final README review           | Pending  | Discover    | Not started  | Screenshot links marked pending                      | Product UI incomplete               | Capture final desktop and mobile views            |
| Pitch deck and final rehearsal                | Pending  | All         | Not started  | `docs/demo-script.md` scaffold                       | Finalist status unknown             | Prepare after MVP stabilization                   |
