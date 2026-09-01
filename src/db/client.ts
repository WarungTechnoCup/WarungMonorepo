import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDatabaseUrl } from "@/lib/env";

export function createDatabaseClient() {
  const queryClient = postgres(getDatabaseUrl(), {
    max: 1,
    prepare: false,
  });

  return drizzle(queryClient);
}
