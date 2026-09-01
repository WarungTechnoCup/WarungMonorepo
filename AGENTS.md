# Repository instructions

## 1. Project purpose

Warung Cek Harga is procurement intelligence for Indonesian warungs. The MVP consists of Harga Wajar, verified price contributions, and Kulakan Bareng. Warung Pulse is roadmap work. Passport is a constrained preview that requires separate consent and protection. Never present roadmap, preview, demo, or scaffold behavior as implemented product functionality.

## 2. Sources of truth

Read these files in order:

1. The current user or issue acceptance criteria.
2. `docs/source/warung-cek-harga-developer-spec.md`.
3. `docs/competition-requirements.md`.
4. `docs/architecture.md`.
5. `docs/progress.md`.
6. `CONTRIBUTING.md`.

The competition guidebook governs submission and judging. The developer specification governs product and implementation decisions. If an architectural decision changes, add or supersede an ADR in `docs/decisions/` and obtain team approval.

## 3. Required contributor startup sequence

1. Read the source-of-truth documents above.
2. Inspect `docs/progress.md` for status and blockers.
3. Run `git status` and preserve unrelated work.
4. Update local `main` before creating work.
5. Create a short `feat/`, `fix/`, or `docs/` branch.
6. Confirm issue ownership before editing shared files.

## 4. Technology boundaries

- Use Next.js App Router and TypeScript.
- Use Tailwind CSS with project-owned components.
- Use Supabase PostgreSQL, Auth, and Storage.
- Use Drizzle schema and versioned migrations.
- Use Zod validation at every write boundary.
- Use Vitest for unit tests and Playwright for user flows.
- Do not replace the framework, ORM, auth provider, database, test tools, or package manager without an ADR and team approval.

## 5. Architecture boundaries

- Organize implementation around catalog, benchmark, price report, normalization, trust, buying, consent, and Passport domains.
- Keep normalization and confidence calculations pure and deterministic.
- Keep supplier quotes separate from community benchmarks.
- Keep public, authenticated, and admin access boundaries explicit.
- A feature slice may import another slice only through its public interface. Never import another slice's internal modules directly.

## 6. Product and UX rules

- Write user-facing copy in Bahasa Indonesia first.
- Design mobile-first from a 360px baseline.
- Give each screen one primary action.
- Never shame users for reporting or paying higher prices.
- Never expose exact public addresses, warung identities, raw receipts, or identifiable supplier-report relationships.
- Below five independent contributors, show progress instead of a precise benchmark.
- Use plain language and concrete rupiah examples when real data is available.
- Do not invent backend or product behavior for placeholders.

## 7. Privacy and security rules

- Never commit secrets, personal credentials, receipts, phone numbers, or production data.
- Never expose Supabase secret or service-role keys to browser code.
- Validate every write server-side.
- Enable and test row-level security when domain tables are introduced.
- Keep public response fields allowlisted.
- Treat receipt storage and Passport data as sensitive.
- Do not log tokens, receipts, full phone numbers, or raw financial records.

## 8. Database rules

- Generate a reviewable migration for every schema change.
- Applied migrations are append-only. Do not rewrite their history.
- Seed data must be synthetic and clearly marked as demo data.
- Database changes require tests and an update to `docs/architecture.md`.
- Coordinate edits to shared schema indexes before starting.

## 9. Testing and completion rules

- Run the narrowest relevant test while developing.
- Run `pnpm check` before requesting review.
- Add a regression test for every fixed defect.
- Test loading, empty, error, success, and below-threshold states where relevant.
- Test protected data for cross-user access.
- Do not mark work complete without command output or another concrete verification artifact.

## 10. Git and review rules

- Use Conventional Commit messages without AI attribution trailers.
- Keep commits atomic and branches short-lived.
- Do not push directly to protected `main`.
- Do not use `git add -A` when unrelated files are present.
- Do not rewrite or reformat unrelated code.
- Require one teammate review from outside the feature owner.
- Update `docs/progress.md` in the same pull request.

## 11. Writing and code style

- Do not use emoji or em dashes in repository documentation, commits, or source copy.
- Match the surrounding code style.
- Avoid comments that only restate obvious code.
- Use clear names and explicit control flow.
- Preserve user inputs after validation failures.
- Use Bahasa Indonesia for user-facing errors and English for internal code identifiers.

## 12. Definition of done

- Acceptance criteria are satisfied.
- Relevant tests pass.
- Accessibility is checked.
- Security and privacy boundaries are reviewed.
- Documentation and progress are updated.
- No secrets or unrelated changes are included.
- Feature status accurately distinguishes implemented, demo, preview, roadmap, and scaffold behavior.

Human contributors should follow the clone-to-PR process in `CONTRIBUTING.md`.
