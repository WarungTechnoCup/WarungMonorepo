import { getAdminEmails } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class AuthenticationError extends Error {
  constructor() {
    super("Silakan masuk untuk melanjutkan.");
    this.name = "AuthenticationError";
  }
}

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new AuthenticationError();
  }

  return data.user;
}

export class AuthorizationError extends Error {
  constructor() {
    super("Akun Anda tidak memiliki akses administrasi.");
    this.name = "AuthorizationError";
  }
}

/**
 * Administrators are listed in ADMIN_EMAILS rather than stored on a row, so
 * that granting access never requires a schema change and an attacker cannot
 * escalate by writing to the database alone.
 */
export async function requireAdminUser() {
  const user = await requireAuthenticatedUser();
  const allowed = getAdminEmails();
  const email = user.email?.toLowerCase();

  if (allowed.length === 0 || !email || !allowed.includes(email)) {
    throw new AuthorizationError();
  }

  return user;
}
