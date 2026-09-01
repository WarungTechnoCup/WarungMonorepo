# Contributing

Read `AGENTS.md` before starting. It defines product, architecture, privacy, testing, and completion rules. This document describes the human workflow.

## Prerequisites and setup

- Node.js 24
- pnpm 11.19.0
- Git

```bash
git clone <private-repository-url>
cd warung-cek-harga
pnpm install --frozen-lockfile
copy .env.example .env.local
pnpm check
```

The repository has no remote during scaffolding. After the private organization exists, the owner will share the URL and access policy. Do not create a public mirror.

## Environment configuration

Public pages and `pnpm build` work without Supabase credentials. To work on protected features, request development credentials through the team's private channel and place them only in `.env.local`. Never send credentials in issues, commits, screenshots, or chat transcripts.

Use separate Supabase development and production projects when they are created. Never use production data locally.

## Issue assignment and ownership

Assign the issue before coding and record its acceptance criteria. Feature ownership is:

| Slice      | Scope                                                             |
| ---------- | ----------------------------------------------------------------- |
| Discover   | Beranda, search, benchmark, product detail, methodology           |
| Contribute | Auth, reporting, normalization, trust, activity, Passport preview |
| Act        | Kulakan Bareng, commitments, integration, demo readiness          |

One integration owner coordinates `package.json`, `pnpm-lock.yaml`, global styles, shared layouts, and schema indexes. Confirm ownership before editing those files.

## Branches

Update `main`, then create a short branch:

```bash
git switch main
git pull --ff-only
git switch -c feat/12-price-search
```

Use `feat/<issue>-<slug>`, `fix/<issue>-<slug>`, or `docs/<issue>-<slug>`, such as `fix/31-mobile-navigation` and `docs/18-demo-script`.

## Commits and pull requests

- Use Conventional Commits such as `feat: add price search filters`.
- Keep commits atomic and omit AI attribution trailers.
- Stage explicit files when unrelated changes exist.
- Keep `main` releasable and use squash merge for feature pull requests.
- Link the issue, state the slice owner, describe privacy impact, and include verification evidence.
- Update `docs/progress.md` in the same pull request.

## Pemeriksaan wajib

Run the narrowest test while developing, then run:

```bash
pnpm check
pnpm test:e2e
```

Review at 360px and desktop sizes. Include loading, empty, error, success, and below-threshold coverage where applicable. Protected data changes require cross-user access tests.

## Migration coordination

Tell the integration owner before editing shared schema indexes. Generate migrations with `pnpm db:generate`, review the SQL, and commit schema plus migration together. Never edit an applied migration. Seeds must be synthetic and labeled as demo data.

## Review and conflicts

One teammate outside the feature slice must approve. Resolve design or implementation conflicts using this order: acceptance criteria, developer specification, competition requirements, architecture, then the relevant ADR. If the decision changes architecture, write an ADR before merging.

CODEOWNERS will be added after teammate GitHub handles are known.
