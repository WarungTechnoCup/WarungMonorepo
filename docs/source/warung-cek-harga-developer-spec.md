# Warung Cek Harga

## Comprehensive Developer Specification

This document defines the MVP, competition strategy, user experience, architecture, data model, trust methodology, privacy boundaries, implementation plan, and acceptance criteria for Warung Cek Harga.
## 1. Executive summary

Warung Cek Harga is a mobile-first procurement intelligence network for Indonesian warung owners. It answers: Harga saya kemahalan tidak, warung sekitar membeli dengan harga berapa, apakah pembelian bersama dapat menurunkan biaya, and how to organize proof of business activity.

Users submit FMCG purchase prices. The system converts different packaging and transaction formats into comparable landed unit costs, filters duplicates and suspicious reports, and publishes an aggregated local benchmark only when enough independent data exists.

Product thesis: Warung Cek Harga is a community-powered procurement intelligence network that lets warung owners anonymously discover a fair local purchase price, verify whether they are overpaying, and combine demand to negotiate better terms.

Warung Pulse is a future inventory and margin layer based on explicitly reported sales, stock, or outflow data. Warung Passport is a consent-based business activity record, not a credit score and not a lending decision.

## 2. Guidebook and judge alignment

Source: uploaded WebDev Guidebook (Mahasiswa) ITechnoCup 2026 (3).pdf and the referenced Evaluate Warung Cek Harga conversation.

| Constraint | Requirement | Source |
|---|---|---|
| Theme | Adaptive Innovation for a Future-Ready Digital Society | Guidebook pp. 1, 3 |
| SDGs | Claim SDG 8 primarily and SDG 9 secondarily | Guidebook pp. 1, 3 |
| Eligibility | Original work, not commercially published or a previous winner | Guidebook pp. 4 to 5 |
| Frameworks and AI | Allowed when documented and used responsibly with privacy, security, and copyright controls | Guidebook pp. 5 to 6 |
| Submission | GitHub repository and hosted website | Guidebook p. 7 |
| README | Application, technology, features, installation, and usage | Guidebook p. 7 |
| Deadline | 6 September 2026 at 23:59 WIB | Guidebook p. 10 |
| Final | 10-minute presentation and 10-minute Q&A | Guidebook p. 12 |
| Preliminary score | Theme 20%, innovation 20%, functionality 20%, UI/UX 15%, technology 15%, documentation 10% | Guidebook pp. 14 to 15 |
| Final score | Pitch 25%, live demo 25%, innovation and impact 20%, technical aspects 20%, Q&A 10% | Guidebook pp. 16 to 17 |

Execution is decisive: the preliminary rubric assigns 60% to functionality, UI/UX, technology, and documentation. The final assigns 45% to live demo and technical aspects, plus 10% to Q&A.

Positioning: Kami tidak membangun POS baru. Kami membangun lapisan intelijen pengadaan yang netral.

Primary SDG 8 means better economics for UMKM and micro-retail. Secondary SDG 9 means modern digital information infrastructure. Do not claim SDG 7 or 11 unless implemented features justify them.

## 3. Product architecture and business model

| Layer | Product | Status | User question |
|---|---|---|---|
| 1 | Harga Wajar | MVP core | Harga kulakan saya kemahalan tidak? |
| 2 | Kulakan Bareng | MVP core | Bisa beli bersama agar lebih murah? |
| 3 | Warung Pulse | Roadmap | Apa dan berapa yang sebaiknya saya stok? |
| 4 | Warung Passport | Constrained preview | Bagaimana saya menunjukkan aktivitas usaha? |

Data flywheel: contribution -> intelligence -> savings -> transactions -> longitudinal data -> optional inventory intelligence and business activity record.

Production revenue may combine a transparent supplier transaction fee, cooperative administration subscription, premium user-controlled exports, and consented institutional reports. Supplier payment must never alter a community benchmark. Sponsored offers must be labeled. Do not sell raw receipts or identifiable financial data without separate consent.

## 4. Personas

- Bu Sari: neighborhood owner using WhatsApp, calculator, notebook, and supplier visits. Needs a trustworthy answer in under two minutes.
- Mas Dedi: digitally active multi-warung operator who wants comparison, group buying, filters, and savings history.
- Community coordinator: manages a local group or koperasi and needs aggregate quantities, deadlines, quotes, and privacy.
- Supplier: wants qualified aggregate demand but cannot edit benchmarks.
- Judge: needs fast comprehension, stable demo, credible technical depth, and a runnable repository.

## 5. Accessibility and low-literacy UX

- Bahasa Indonesia first. Use Harga kamu, Harga warung sekitar, Laporkan harga, and Beli bareng.
- Use rupiah such as Rp2.850, concrete examples, and kecamatan or kelurahan rather than exact public addresses.
- One primary action per screen; main answer above the fold; tap targets at least 44 by 44 CSS pixels.
- Search suggestions instead of long dropdowns. Preserve inputs after validation errors. Provide Coba dengan data contoh.
- Support WhatsApp share text and explicit offline states. Avoid exact GPS and horizontal scrolling.
- Body text at least 16px on mobile, strong contrast, visible keyboard focus, reduced-motion support, and text summaries for charts.
- Never shame owners for paying more. Say 8,8% di atas median area, not Anda kemahalan.
- Explain that delivery, payment terms, quantity, and freshness may explain differences.
- Put privacy guidance beside contribution and sharing actions.

## 6. Information architecture and routes

Public navigation: Beranda, Cek Harga, Cara Kerja, Privasi, Masuk or data contoh. Authenticated navigation: Beranda, Cek Harga, Laporkan Harga, Kulakan Bareng, Aktivitas Saya, Profil Warung. Admin navigation: Moderasi, Katalog, Opportunities, Audit Log, System Health.

| Route | Purpose | Access |
|---|---|---|
| / | Value proposition and search | Public |
| /cek-harga | Search and benchmark | Public |
| /produk/:slug | Product detail and methodology | Public |
| /lapor-harga | Guided contribution | Authenticated or demo |
| /lapor-harga/sukses | Normalization result | Contributor |
| /kulakan-bareng | Opportunities | Public or authenticated |
| /kulakan-bareng/:id | Opportunity and commitment | Authenticated to commit |
| /aktivitas | Reports and commitments | Authenticated |
| /passport | Activity record preview | Authenticated, opt-in |
| /cara-kerja | Plain-language method | Public |
| /privasi | Notice and controls | Public |
| /admin | Moderation and demo controls | Admin |

## 7. Page specifications

### Beranda

Headline: Cek apakah harga kulakan warung Anda sudah wajar. Supporting line: Bandingkan harga dari warung sekitar. Laporkan harga. Beli bersama. Include search, Cek Harga, Coba dengan data contoh, privacy note, three-step explanation, benchmark example, methodology, and privacy links.

### Cek Harga and product detail

Controls: product search, province/city/kecamatan, 30-day or 90-day window, packaging, supplier type, and payment terms.

Result card: product and pack equivalent, median area price, unit and pack price, optional own-price comparison, rupiah and percentage difference, report count, independent warung count, recency, confidence, methodology disclosure, report CTA, and group-buy CTA.

Below five independent warungs, show Belum cukup laporan untuk membuat patokan area and progress toward five contributors. Never show an individual identity or a supplier tied to a report.

### Laporkan Harga

Four-step wizard: Produk with canonical product; Pembelian with date, packaging, quantity, units per package, gross price, discount, delivery, payment terms, and supplier type; Bukti dan privasi with optional receipt, EXIF stripping, and consent; Review with formula, normalized price, warnings, and correction.

Success must state included, pending review, or excluded, and show a contribution ID.

### Kulakan Bareng

Cards show product, coarse area, target and committed quantity, deadline, target price labeled as estimate, organizer, and CTA. Detail shows specification, progress, benchmark versus target quote, terms, privacy notice, legal guardrail, and quantity commitment.

State machine: DRAFT -> OPEN -> TARGET_REACHED -> QUOTE_REQUESTED -> QUOTE_RECEIVED -> ACCEPTED -> FULFILLED, or CANCELLED. MVP commitment is non-binding unless formal terms are displayed.

### Aktivitas and Passport

Activity shows contributions, verification, benchmark inclusion, commitments, opportunities, and data-quality actions.

Passport must say: Warung Passport membantu merapikan bukti aktivitas usaha. Ini bukan credit score dan tidak menentukan persetujuan pinjaman. Separate Terverifikasi, Dilaporkan, Dihitung, and Estimasi. Include consent, export preview, expiry, and revoke.

## 8. Design system, mobile, and PWA

Use a warm, practical, trustworthy visual language distinct from a bank dashboard or flash-sale marketplace. Suggested palette: deep charcoal, warm off-white, deep green or teal, muted orange, accessible green, amber, and dark red only for destructive actions.

Required components: PriceCard, ConfidenceBadge, VerificationBadge, LocationSelector, ProductSearch, PriceInput, StepWizard, ProgressBar, PrivacyNotice, EmptyState, ErrorState, Toast, ConfirmDialog, BottomNavigation, MethodologyDisclosure.

Mobile uses one-column cards and bottom navigation. Tablet uses two-column results. Desktop widens content while preserving mobile hierarchy. Support 360px width, Android browsers, cached shell, installable manifest, explicit offline state, timestamped last-known benchmark, and safe update prompts.

Target Lighthouse mobile performance of 90 or higher where practical, LCP under 2.5 seconds, route-level code splitting, lazy receipt/admin modules, compressed images, and minimal chart dependencies. Do not store sensitive profile data in plain local storage.

## 9. MVP and roadmap

MVP must include public home and search, catalog, coarse location, price report, landed-unit normalization, median benchmark, counts, verification, confidence, duplicate and anomaly safeguards, consent, correction, collective-buy list/detail/commitment, demo mode, responsive UI, README, methodology, tests, and deployment.

Exclude real payments, lender integrations, automated credit decisions, individually identifiable supplier prices, retail price coordination, full POS/accounting, unreviewed OCR, exact maps, and claims of stock or revenue inferred from purchases.

Roadmap: Phase 2 adds WhatsApp reminders, barcode and aliases, reviewed OCR, supplier quotes, and verified community accounts. Phase 3 adds Warung Pulse with optional sales, stock, outflow, reorder suggestions, and margins. Phase 4 adds Passport timeline, export, expiring links, and reviewed institution integrations. Phase 5 adds multi-region aggregation, fairness monitoring, supplier quality, and fulfillment.

## 10. Data model

Use PostgreSQL for the hosted MVP. Core tables: users; warungs with coarse public location; products; packaging_options; price_reports; normalized_observations; benchmarks; buying_opportunities; buying_commitments; supplier_quotes; consents; audit_events.

price_reports stores private references, product, package, date, quantity, units per package, gross price, discount, delivery fee, terms, supplier type, receipt reference, verification, aggregation, duplicate fingerprint, anomaly state, and timestamps.

normalized_observations stores landed total, base units, unit price, location bucket, recency and verification weights, eligibility, and calculation version. benchmarks stores product, location, window, median, P25, P75, eligible count, independent warung count, confidence, version, and timestamp.

Classification: public aggregate; private operational data; sensitive profile data; derived data; restricted admin data. Never use an exact address as a public grouping key.

## 11. APIs and backend

Default architecture: PWA -> web app and typed API -> domain services -> PostgreSQL, object storage for receipts, and structured logs.

Public API: GET /api/products?query=, GET /api/benchmarks, GET /api/products/:id, GET /api/buying-opportunities, GET /api/buying-opportunities/:id, GET /api/methodology.

Authenticated API: POST /api/price-reports/preview-normalization, POST /api/price-reports, GET and PATCH for own reports, POST /api/buying-opportunities/:id/commitments, GET own commitments, Passport preview/share, consent create/delete.

Admin API: report moderation, benchmark recompute, audit events, and demo reset.

Validate all writes server-side, use idempotency keys, stable error codes, Bahasa Indonesia messages, public-field allowlists, rate limits, pagination, and benchmark metadata with calculation version, timestamp, and data window.

Suggested modules: domain/catalog, domain/normalization, domain/benchmark, domain/trust, domain/buying, domain/consent, domain/passport, infrastructure/db, infrastructure/storage, infrastructure/observability. Keep normalization and trust calculations pure and tested.

## 12. Price normalization

Formula: landed_total_idr = gross_price_idr - discount_idr + delivery_fee_idr. base_units_total = quantity_packages * units_per_package. unit_price_idr = landed_total_idr / base_units_total.

Example: 1 karton, 40 pieces, gross Rp118.000, delivery Rp5.000, normalized price Rp3.075 per piece.

Require canonical product identity, explicit packaging equivalence, correct base unit, positive quantities, non-negative landed total, stated delivery allocation, payment-term dimension, and labeled cross-location comparisons.

Eligible observations have valid product, conversion, date, cost, duplicate status, anomaly status, and aggregation consent. Use median and interquartile range. Flag but do not silently delete outliers. Store reason codes and calculation versions.

## 13. Trust and confidence

The score communicates aggregate reliability. It is not a seller rating or credit score.

Inputs: n eligible reports, u independent warungs, r recency, v verification, d dispersion, q completeness.

Formula: confidence = clamp(100 * (0.30 * min(u / 20, 1) + 0.20 * min(n / 30, 1) + 0.15 * r + 0.15 * v + 0.10 * d + 0.10 * q), 0, 100).

Labels: Tinggi is 75 to 100 with at least five warungs; Sedang is 50 to 74 with at least five; Terbatas is below 50 or fewer than five. Below five, show progress rather than a precise benchmark.

Controls: rate limits, one active contribution per product and short window, duplicate fingerprints, constrained identity creation, extreme-pattern flags, and moderator audit reasons.

## 14. Privacy, security, and PDP

Collect only authentication, administrative location, normalization inputs, verification, group-buy coordination, and requested exports. Do not collect exact GPS, national IDs, bank credentials, or unrelated details.

Separate versioned consent for account creation, anonymous aggregation, receipt storage, opportunity contact sharing, and Passport sharing. Users see raw own reports. Public users see thresholded aggregates. Organizers see aggregate commitments. Suppliers see only quote data. Passport links are scoped, expiring, and revocable.

Security baseline: secure sessions, protected cookies, hashed or encrypted phone identifiers, encrypted receipt storage where supported, EXIF stripping, MIME and size validation, CSRF protection, escaped user text, parameterized queries, HTTPS, security headers, rate limits, redacted logs, correction, deletion, and export audit trails.

Production needs legal review of Indonesian personal-data obligations. Do not claim full legal compliance merely because a privacy page exists.

Passport may show active period, verified procurement, reported sales only when actually entered, completeness, purchase consistency, supplier diversity, export time, and methodology version. It must not assign lending score, recommend approval or rejection, present estimated revenue as verified, share without consent, or publicly rank warungs.

## 15. Collective buying and legal guardrails

Allowed: aggregate independent demand, request supplier quotes, show anonymous progress, let warungs independently accept or decline, and record terms and fulfillment.

Prohibited: coordinate retail selling prices, tell warungs what consumer price to charge, expose identifiable competitor prices, let suppliers edit benchmarks, or present MVP interest as binding.

Required copy: Kulakan Bareng menggabungkan kebutuhan pembelian agar warung dapat meminta penawaran. Setiap warung tetap bebas menentukan harga jual, supplier, dan keputusan pembeliannya sendiri.

Keep community benchmarks and supplier quotes in separate tables, APIs, and UI. Label target prices as estimates until quoted. Show delivery, fees, minimum quantity, validity, and cancellation terms.

## 16. Observability, testing, analytics

Track request ID, route, status, latency, error code, demo flag, normalization version, and benchmark version. Never log receipts, full phone numbers, tokens, or raw financial records.

Unit tests: rupiah parsing, packaging conversion, landed cost, duplicate fingerprint, outlier flagging, confidence, threshold, Passport classification. Integration tests: persistence, recompute, flagged exclusion, idempotency, commitments, consent revocation. E2E tests: search, report, benchmark update, group-buy, mobile viewport, keyboard navigation. Security tests: cross-user access, public leakage, malicious uploads, rate limiting, injection, expired links.

Analytics events: home_viewed, product_searched, benchmark_viewed, price_report_started, price_report_previewed, price_report_submitted, price_report_flagged, buying_opportunity_viewed, buying_commitment_created, passport_preview_viewed, passport_share_created. Use anonymous or consented IDs and exclude raw receipt data.

## 17. Seed and demo data

Use synthetic data labeled Data demo. Location: DKI Jakarta, Jakarta Barat, Kecamatan Contoh. Seed 8 to 12 familiar FMCG products.

Hero SKU: at least 23 eligible reports, 18 independent warungs, recent and older reports, receipt-verified reports, one duplicate, one outlier, and one incomplete report. Seed a group-buy opportunity with 37 of 50 cartons committed, a near deadline, a target price labeled target, and one separate supplier quote.

Provide demo mode or documented credentials without exposing a personal account.

## 18. Deployment and README

Use local, preview, and production environments. Release requires documented environment variables, migrations, seed data, clean-browser test, demo test, upload restrictions, HTTPS, monitoring, health check, current links, tagged reproducible commit, and no secrets in GitHub.

Use a reliable free host recommended by the guidebook, such as Vercel or Netlify, plus a managed database. Maintain a read-only demo snapshot if the backend fails.

README must include name and thesis, hosted URL, demo instructions, problem, users, features, SDGs, technology and reasons, architecture, data model, normalization, confidence, privacy, competition guardrails, installation, environment variables, migrations, seed, commands, tests, demo walkthrough, limitations, roadmap, AI disclosure, licenses, and team roles.

Recommended structure: app or src, components, domain, lib, db/migrations, db/seed, public, tests/unit, tests/integration, tests/e2e, docs/architecture.md, docs/methodology.md, docs/privacy.md, docs/demo-script.md, .env.example, README.md.

## 19. Five-day plan

Day 1: app shell, routes, visual system, home, search, product detail, demo mode, seed catalog, preview deployment. Exit: judge understands in 30 seconds.

Day 2: schema, report form, pure normalization, fixtures, median, threshold, confidence, unit tests. Exit: benchmark comes from stored observations.

Day 3: opportunities, commitments, quotes, activity, consent, access control, redaction, Passport preview. Exit: persistent loop without identity leakage.

Day 4: mobile states, accessibility, performance, integration and E2E smoke tests, README, methodology, screenshots, architecture. Exit: clean mobile browser and runnable repository.

Day 5: freeze scope, production migration and seed, clean-browser and second-device tests, tagged commit, rehearsal, fallback recording or snapshot. Exit: every pitch claim is supported or labeled roadmap.

## 20. Judge demo script

0:00 to 0:30: explain the missing independent kulakan benchmark. 0:30 to 1:00: state thesis and cek, laporkan, beli bareng. 1:00 to 2:00: search Indomie Goreng 85g, choose Kecamatan Contoh, show median, unit price, count, recency, confidence, enter Rp3.100, and show difference. 2:00 to 3:00: enter one carton, 40 pieces, Rp118.000, and Rp5.000 delivery; show Rp3.075 per piece. 3:00 to 4:00: explain median, five-warung threshold, recency, verification, dispersion, and flagged outlier. 4:00 to 5:00: open 37 of 50 cartons, add commitment, explain procurement-only coordination, and show Passport non-credit boundary.

Prepare answers for false reports, median, threshold, competitors, revenue inference, competition law, personal data, deletion, scale, and AI use.

## 21. Decision rationale

- Procurement intelligence instead of a super-app: existing products cover bookkeeping, POS, wholesale ordering, stock, and financing. A neutral benchmark is sharper and finishable.
- Harga Wajar first: immediate value creates repeat usage and data for later layers.
- Median: resists one extreme value and is easy to explain.
- Landed base-unit cost: packaging formats are otherwise not comparable.
- Anonymity threshold: prevents re-identification and creates a contribution incentive.
- Data labels: purchases do not prove sales, revenue, turnover, or profitability.
- Warung Passport: an activity record avoids unsupported lending claims.
- Procurement guardrail: demand aggregation supports warungs; retail price coordination creates legal and ethical risk.
- Honest synthetic demo data: reliable when clearly labeled.
- Mobile-first Bahasa Indonesia: matches device, literacy, connectivity, and time pressure.
- Modular monolith: fast delivery, simple deployment, clear domain boundaries.
- Visible methodology: user trust plus evidence for the technology score.

## 22. Acceptance criteria and definition of done

- [ ] Search and benchmark work without a manual.
- [ ] Basic report takes under 90 seconds on mobile.
- [ ] Pieces, packs, and cartons normalize correctly.
- [ ] Benchmark shows median, count, recency, and confidence.
- [ ] Below-threshold data does not produce a precise public benchmark.
- [ ] Reports show pending, included, flagged, or excluded.
- [ ] User can view and commit to a buying opportunity.
- [ ] Estimate and supplier quote are separate.
- [ ] Passport states it is not a credit score.
- [ ] Primary flows work at 360px with labels, focus states, large targets, contrast, and text chart summaries.
- [ ] Loading, empty, error, and success states exist.
- [ ] Server validation exists for every write and writes are idempotent.
- [ ] Public APIs contain no private fields.
- [ ] Uploads are restricted and metadata is handled.
- [ ] Core calculations have tests and benchmarks store version and timestamp.
- [ ] Moderator actions create audit events and secrets are absent from source control.
- [ ] GitHub repository, hosted URL, README, AI disclosure, licenses, and tagged commit are ready.

Definition of done: the hosted Cek Harga to Laporkan Harga to normalized benchmark to Kulakan Bareng flow works; calculations are tested and versioned; the UI works on a low-end mobile viewport in Bahasa Indonesia; data classes are separated; privacy, consent, access control, and competition guardrails are implemented; demo data is deterministic; the README runs the repository; the team can answer Q&A; the demo has a fallback; and no roadmap capability is presented as implemented.

## References

- Uploaded WebDev Guidebook (Mahasiswa) ITechnoCup 2026 (3).pdf, especially pp. 1 to 18.
- Referenced conversation Evaluate Warung Cek Harga, including thesis, competitor positioning, four-layer architecture, normalization, median, threshold, Passport boundary, and collective-buying guardrails.

