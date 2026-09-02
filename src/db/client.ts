import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDatabaseUrl } from "@/lib/env";

type DatabaseClient = ReturnType<typeof drizzle>;

let databaseClient: DatabaseClient | undefined;

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

export function getDatabaseClient() {
  if (!databaseClient) {
    databaseClient = createDatabaseConnection().db;
  }

  return databaseClient;
}
