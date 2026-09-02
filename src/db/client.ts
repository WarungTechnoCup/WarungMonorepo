import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDatabaseUrl } from "@/lib/env";

export function createDatabaseConnection() {
  const queryClient = postgres(getDatabaseUrl(), {
    max: 1,
    prepare: false,
  });

  return {
    db: drizzle(queryClient),
    close: () => queryClient.end(),
  };
}

export function createDatabaseClient() {
  return createDatabaseConnection().db;
}
