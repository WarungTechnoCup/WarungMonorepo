// @vitest-environment node

import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  path.join(process.cwd(), "drizzle", "0000_spotty_surge.sql"),
  "utf8",
);

describe("Harga Wajar migration security", () => {
  it("enables RLS for every domain table", () => {
    for (const table of [
      "warungs",
      "products",
      "packaging_options",
      "receipt_objects",
      "price_reports",
      "normalized_observations",
      "benchmarks",
      "consents",
      "audit_events",
    ]) {
      expect(migration).toContain(
        `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`,
      );
    }
  });

  it("keeps private tables out of direct anonymous and authenticated access", () => {
    expect(migration).toContain(
      'REVOKE ALL ON TABLE "warungs", "receipt_objects", "price_reports", "normalized_observations", "consents", "audit_events" FROM anon, authenticated',
    );
    expect(migration).toContain('CREATE POLICY "reports_owner_read"');
    expect(migration).toContain('"owner_auth_user_id" = auth.uid()');
  });

  it("enforces the five-warung publication threshold in PostgreSQL", () => {
    expect(migration).toContain(
      'ADD CONSTRAINT "benchmark_publication_threshold"',
    );
    expect(migration).toContain('"independent_warung_count" >= 5');
  });
});
