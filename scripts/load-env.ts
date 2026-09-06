import { existsSync } from "node:fs";

/**
 * Node and tsx disagree about --env-file flags across versions: --env-file
 * exits with code 9 when the file is absent, and --env-file-if-exists does
 * not exist before Node 22. Loading configuration here keeps the scripts
 * working on every supported version, and matches what drizzle.config.ts
 * already does.
 *
 * Precedence follows Next: .env first, then .env.local overrides it.
 */
for (const file of [".env", ".env.local"]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
  }
}
