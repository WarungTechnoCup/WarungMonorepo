# Security policy

## Supported version

Only the current `main` branch is supported during the competition.

## Reporting a vulnerability

Do not open a public issue containing exploit details, credentials, receipts, phone numbers, or production data. Contact the repository owner through the team's private channel and include:

- affected route or component;
- reproducible steps using synthetic data;
- expected and observed access boundary;
- suggested severity and impact.

The integration owner coordinates triage. Confirm receipt within two working days, limit access to the smallest group needed, and add a regression test before closing the fix.

## Baseline controls

- Never expose Supabase secret or service-role keys to browser code.
- Validate every write on the server.
- Add row-level security before introducing domain tables.
- Treat receipts and Passport data as sensitive.
- Keep logs free of tokens, raw receipts, full phone numbers, and financial records.
- Use synthetic data for development and demonstrations.
