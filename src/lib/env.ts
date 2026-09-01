import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

const serverEnvironmentSchema = publicEnvironmentSchema.extend({
  DATABASE_URL: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("price-receipts"),
  DEMO_MODE: z.enum(["true", "false"]).default("false"),
});

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export function getPublicEnvironment() {
  return publicEnvironmentSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || undefined,
  });
}

export function getServerEnvironment() {
  return serverEnvironmentSchema.parse({
    ...getPublicEnvironment(),
    DATABASE_URL: process.env.DATABASE_URL || undefined,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || undefined,
    DEMO_MODE: process.env.DEMO_MODE || undefined,
  });
}

export function getSupabasePublicConfig() {
  const environment = getPublicEnvironment();

  if (
    !environment.NEXT_PUBLIC_SUPABASE_URL ||
    !environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new ConfigurationError(
      "Supabase belum dikonfigurasi. Salin .env.example ke .env.local dan isi URL serta publishable key.",
    );
  }

  return {
    url: environment.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function getDatabaseUrl() {
  const { DATABASE_URL } = getServerEnvironment();

  if (!DATABASE_URL) {
    throw new ConfigurationError(
      "DATABASE_URL belum dikonfigurasi. Gunakan URL transaction pooler Supabase.",
    );
  }

  return DATABASE_URL;
}

export function getServiceConfiguration() {
  const environment = getServerEnvironment();
  const supabaseConfigured =
    Boolean(environment.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  return {
    supabase: supabaseConfigured,
    database: Boolean(environment.DATABASE_URL),
    storage: supabaseConfigured && Boolean(environment.SUPABASE_STORAGE_BUCKET),
    demoMode: environment.DEMO_MODE === "true",
  };
}
