import { existsSync } from "node:fs";

import { defineConfig } from "drizzle-kit";

import { getDatabaseUrl } from "./src/lib/env";

// drizzle-kit does not read .env itself, and this config resolves the
// connection string at load time. Without this, db:generate and db:migrate
// fail with a configuration error even when the file is correct.
for (const file of [".env", ".env.local"]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
  }
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
  strict: true,
  verbose: true,
});
