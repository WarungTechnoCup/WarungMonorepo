# Team workflow

## Ownership

The three-person team works in feature slices:

1. **Discover:** Beranda, search, benchmark, product detail, methodology.
2. **Contribute:** auth, reporting, normalization, trust, activity, Passport preview.
3. **Act:** Kulakan Bareng, commitments, integration, and demo readiness.

One integration owner coordinates changes to `package.json`, `pnpm-lock.yaml`, global styles, shared layouts, and schema indexes. This role coordinates shared files and does not own every implementation.

## Branch and review flow

1. Assign the issue and confirm acceptance criteria.
2. Update `main` using fast-forward only.
3. Create a short branch such as `feat/12-price-search`, `fix/31-mobile-navigation`, or `docs/18-demo-script`.
4. Run focused tests during implementation.
5. Update `docs/progress.md` with evidence.
6. Run `pnpm check` and relevant Playwright tests.
7. Request one review from a teammate outside the feature slice.
8. Squash the feature pull request and keep `main` releasable.

Do not push directly to protected `main` after the organization remote exists. CODEOWNERS remains pending until GitHub handles are known.

## Shared decisions

Architecture changes require an ADR and team approval. Resolve conflicts using source precedence: current acceptance criteria, developer specification, competition guidebook, architecture, then prior conversation rationale.

When two branches need the same shared file, the integration owner sequences the changes. Rebase or update after the first pull request merges, then regenerate affected lockfiles or migrations.

## Communication

Record ownership, blockers, and verification in the issue and `docs/progress.md`. Keep secrets and personal data out of issues. Escalate access-control, receipt, consent, and Passport decisions to all three members before implementation.
