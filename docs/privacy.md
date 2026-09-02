# Privacy design

## Principles

- Minimize collection to the stated product purpose.
- Obtain purpose-specific consent before a new use.
- Keep private evidence separate from public aggregates.
- Give users clear correction, withdrawal, and deletion paths.
- Use synthetic data in development and demos.

## Data classification

| Class              | Examples                                                 | Baseline handling                                     |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------- |
| Public aggregate   | Canonical product, coarse region, privacy-safe benchmark | Allowlisted response only                             |
| Account private    | Email, user-owned activity, commitments                  | Authenticated owner access and RLS                    |
| Sensitive evidence | Raw receipt, supplier relationship, full phone number    | Private Storage, short-lived access, strict retention |
| Restricted derived | Passport indicators, trust review                        | Purpose-specific consent, auditable access            |

Exact addresses, warung identities, raw receipts, and identifiable supplier-report relationships are never public. Logs exclude tokens, receipts, full phone numbers, and raw financial records.

## Controls before data collection

No real user data may be collected until schema ownership, RLS, private Storage policies, retention, deletion, consent withdrawal, public allowlists, and cross-user tests are complete. The privacy notice must name each purpose in plain Bahasa Indonesia.

The first Harga Wajar migration enables RLS on all domain tables, forces it on private records, revokes direct access to operational tables, and exposes only active catalog rows plus aggregate benchmark rows. Receipt upload remains disabled until private Storage, retention, deletion, metadata removal, signed access, and cross-user tests are implemented.
