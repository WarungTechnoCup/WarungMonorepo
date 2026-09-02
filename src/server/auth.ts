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
