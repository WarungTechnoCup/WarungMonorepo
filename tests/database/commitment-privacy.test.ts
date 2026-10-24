import { randomUUID } from "node:crypto";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const connectionString = process.env.RLS_TEST_DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "RLS_TEST_DATABASE_URL must point to a disposable local PostgreSQL server with database-creation privileges.",
  );
}

const adminUrl = new URL(connectionString);
if (!["127.0.0.1", "localhost", "[::1]"].includes(adminUrl.hostname)) {
  throw new Error("Database regression tests only accept a local server.");
}

const ownerA = "10000000-0000-4000-8000-000000000001";
const ownerB = "10000000-0000-4000-8000-000000000002";
const nonmember = "10000000-0000-4000-8000-000000000003";
const warungA = "20000000-0000-4000-8000-000000000001";
const warungB = "20000000-0000-4000-8000-000000000002";
const opportunityId = "30000000-0000-4000-8000-000000000001";
const otherOpportunityId = "30000000-0000-4000-8000-000000000002";
const migrationsFolder = path.join(process.cwd(), "drizzle");

describe.each(["fresh", "upgrade"] as const)(
  "%s database commitment privacy",
  (installation) => {
    const databaseName = `wch_rls_${randomUUID().replaceAll("-", "")}`;
    const databaseUrl = new URL(adminUrl);
    databaseUrl.pathname = `/${databaseName}`;
    const admin = postgres(adminUrl.toString(), { max: 1 });
    const sql = postgres(databaseUrl.toString(), { max: 1 });
    let publicList: typeof import("@/app/api/buying-opportunities/route").GET;

    async function asRole(
      role: "anon" | "authenticated",
      userId: string | null,
      statement: string,
    ) {
      return sql.begin(async (tx) => {
        await tx.unsafe(`SET LOCAL ROLE ${role}`);
        await tx`SELECT set_config('request.jwt.claim.sub', ${userId ?? ""}, true)`;
        return tx.unsafe(statement);
      });
    }

    beforeAll(async () => {
      await admin.unsafe(`CREATE DATABASE ${databaseName}`);
      await sql.unsafe(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
            CREATE ROLE anon NOLOGIN NOSUPERUSER NOBYPASSRLS;
          END IF;
          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
            CREATE ROLE authenticated NOLOGIN NOSUPERUSER NOBYPASSRLS;
          END IF;
        END $$;
        CREATE SCHEMA auth;
        CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
          'SELECT NULLIF(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
        GRANT USAGE ON SCHEMA public, auth TO anon, authenticated;
        CREATE SCHEMA storage;
        CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean);
        CREATE TABLE storage.objects (id uuid PRIMARY KEY, bucket_id text, name text);
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
        CREATE FUNCTION storage.foldername(text) RETURNS text[] LANGUAGE sql AS
          'SELECT string_to_array($1, ''/'')';
      `);

      if (installation === "upgrade") {
        const priorFolder = await mkdtemp(
          path.join(tmpdir(), "wch-migrations-"),
        );
        try {
          const journal = JSON.parse(
            await readFile(
              path.join(migrationsFolder, "meta/_journal.json"),
              "utf8",
            ),
          ) as { entries: { idx: number; tag: string }[] };
          journal.entries = journal.entries.filter((entry) => entry.idx <= 2);
          await mkdir(path.join(priorFolder, "meta"));
          await writeFile(
            path.join(priorFolder, "meta/_journal.json"),
            JSON.stringify(journal),
          );
          for (const entry of journal.entries) {
            await copyFile(
              path.join(migrationsFolder, `${entry.tag}.sql`),
              path.join(priorFolder, `${entry.tag}.sql`),
            );
          }
          await migrate(drizzle(sql), { migrationsFolder: priorFolder });
        } finally {
          await rm(priorFolder, { recursive: true, force: true });
        }
      } else {
        await migrate(drizzle(sql), { migrationsFolder });
      }

      await sql.unsafe(`
        INSERT INTO products (id, slug, name, brand, base_unit, description, is_demo)
        VALUES ('40000000-0000-4000-8000-000000000001', 'privacy-test', 'Produk demo', 'Demo', 'piece', 'Synthetic privacy fixture', true);
        INSERT INTO packaging_options (id, product_id, label, units_per_package, base_unit)
        VALUES ('50000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'Karton demo', 40, 'piece');
        INSERT INTO warungs (id, owner_auth_user_id, display_name, province, city, district, is_demo)
        VALUES ('${warungA}', '${ownerA}', 'Warung demo A', 'DKI Jakarta', 'Jakarta Barat', 'Kecamatan Contoh', true),
               ('${warungB}', '${ownerB}', 'Warung demo B', 'DKI Jakarta', 'Jakarta Barat', 'Kecamatan Contoh', true);
        INSERT INTO buying_opportunities (id, product_id, packaging_option_id, province, city, district, target_quantity_packages, target_price_idr, deadline, organizer_name)
        VALUES ('${opportunityId}', '40000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'DKI Jakarta', 'Jakarta Barat', 'Kecamatan Contoh', 50, 100000, now() + interval '7 days', 'Koperasi demo'),
               ('${otherOpportunityId}', '40000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'DKI Jakarta', 'Jakarta Barat', 'Kecamatan Contoh', 50, 100000, now() + interval '7 days', 'Koperasi demo');
        INSERT INTO buying_commitments (opportunity_id, warung_id, quantity_packages)
        VALUES ('${opportunityId}', '${warungA}', 3), ('${opportunityId}', '${warungB}', 7);
      `);

      if (installation === "upgrade") {
        const exposed = await asRole(
          "anon",
          null,
          "SELECT warung_id, quantity_packages FROM buying_commitments ORDER BY warung_id",
        );
        expect(exposed).toEqual([
          { warung_id: warungA, quantity_packages: 3 },
          { warung_id: warungB, quantity_packages: 7 },
        ]);
        await migrate(drizzle(sql), { migrationsFolder });
      }

      vi.resetModules();
      vi.stubEnv("DATABASE_URL", databaseUrl.toString());
      publicList = (await import("@/app/api/buying-opportunities/route")).GET;
    });

    afterAll(async () => {
      vi.unstubAllEnvs();
      await sql.end();
      await admin.unsafe(
        `DROP DATABASE IF EXISTS ${databaseName} WITH (FORCE)`,
      );
      await admin.end();
    });

    it("denies anonymous access to individual quantities and warung IDs", async () => {
      await expect(
        asRole("anon", null, "SELECT * FROM buying_commitments"),
      ).rejects.toMatchObject({ code: "42501" });
    });

    it.each([
      [ownerA, warungA, 3],
      [ownerB, warungB, 7],
    ])(
      "shows only the commitment owned by %s",
      async (owner, warung, quantity) => {
        const rows = await asRole(
          "authenticated",
          owner as string,
          "SELECT warung_id, quantity_packages FROM buying_commitments",
        );
        expect(rows).toEqual([
          { warung_id: warung, quantity_packages: quantity },
        ]);
      },
    );

    it.each([nonmember, null])(
      "hides commitments from an authenticated nonowner %s",
      async (userId) => {
        expect(
          await asRole(
            "authenticated",
            userId,
            "SELECT * FROM buying_commitments",
          ),
        ).toEqual([]);
      },
    );

    it("keeps ownership lookup scoped and profile fields private", async () => {
      expect(
        await asRole(
          "authenticated",
          ownerA,
          "SELECT id, owner_auth_user_id FROM warungs",
        ),
      ).toEqual([{ id: warungA, owner_auth_user_id: ownerA }]);
      await expect(
        asRole("authenticated", ownerA, "SELECT display_name FROM warungs"),
      ).rejects.toMatchObject({ code: "42501" });
    });

    it("allows an owner insert and denies another owner's insert", async () => {
      await expect(
        asRole(
          "authenticated",
          ownerA,
          `INSERT INTO buying_commitments (opportunity_id, warung_id, quantity_packages) VALUES ('${otherOpportunityId}', '${warungB}', 5)`,
        ),
      ).rejects.toMatchObject({ code: "42501" });
      expect(
        await asRole(
          "authenticated",
          ownerA,
          `INSERT INTO buying_commitments (opportunity_id, warung_id, quantity_packages) VALUES ('${otherOpportunityId}', '${warungA}', 2) RETURNING warung_id, quantity_packages`,
        ),
      ).toEqual([{ warung_id: warungA, quantity_packages: 2 }]);
    });

    it("does not grant direct commitment updates or deletes", async () => {
      for (const statement of [
        "UPDATE buying_commitments SET quantity_packages = 999",
        "DELETE FROM buying_commitments",
      ]) {
        await expect(
          asRole("authenticated", ownerA, statement),
        ).rejects.toMatchObject({ code: "42501" });
      }
    });

    it("preserves the public API aggregate without individual commitments", async () => {
      const response = await publicList(
        new Request("http://localhost/api/buying-opportunities"),
      );
      expect(response.status).toBe(200);
      const { data } = (await response.json()) as {
        data: Record<string, unknown>[];
      };
      const opportunity = data.find((row) => row.id === opportunityId);
      expect(opportunity).toEqual({
        id: opportunityId,
        productName: "Produk demo",
        productSlug: "privacy-test",
        packagingLabel: "Karton demo",
        targetQuantityPackages: 50,
        targetPriceIdr: 100000,
        deadline: expect.any(String),
        status: "OPEN",
        organizerName: "Koperasi demo",
        province: "DKI Jakarta",
        city: "Jakarta Barat",
        district: "Kecamatan Contoh",
        committedQuantity: 10,
      });
      const body = JSON.stringify(data);
      for (const privateId of [ownerA, ownerB, warungA, warungB]) {
        expect(body).not.toContain(privateId);
      }
    });
  },
);
