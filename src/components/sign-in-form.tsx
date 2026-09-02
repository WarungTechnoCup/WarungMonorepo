"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SignInFormProps {
  nextPath: string;
  configurationMessage?: string;
  authenticationMessage?: string;
}

export function SignInForm({
  nextPath,
  configurationMessage,
  authenticationMessage,
}: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="mx-auto max-w-lg">
        <p className="eyebrow">Akses akun</p>
        <h1 className="text-ink mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Masuk untuk melaporkan harga.
        </h1>
        <p className="text-ink-muted mt-5 leading-7">
          Aktivitas dan bukti tetap menjadi data pribadi. Benchmark publik hanya
          menampilkan agregat yang telah melewati ambang privasi.
        </p>

        {configurationMessage || authenticationMessage ? (
          <div className="border-accent/30 bg-accent/5 text-ink mt-7 rounded-2xl border p-4 text-sm leading-6">
            {configurationMessage ?? authenticationMessage}
          </div>
        ) : null}

        <form
          className="border-ink/12 bg-paper mt-8 space-y-5 rounded-3xl border p-6 sm:p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            setError(null);
            try {
              const supabase = createSupabaseBrowserClient();
              const { error: signInError } =
                await supabase.auth.signInWithPassword({
                  email,
                  password,
                });
              if (signInError) {
                setError("Email atau kata sandi tidak cocok.");
                return;
              }
              router.push(nextPath);
              router.refresh();
            } catch (signInError) {
              setError(
                signInError instanceof Error
                  ? signInError.message
                  : "Layanan masuk belum tersedia.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <label className="text-ink text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className="border-ink/15 text-ink mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:border-[var(--accent)]"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div>
            <label
              className="text-ink text-sm font-semibold"
              htmlFor="password"
            >
              Kata sandi
            </label>
            <input
              autoComplete="current-password"
              className="border-ink/15 text-ink mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:border-[var(--accent)]"
              id="password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          {error ? (
            <p className="text-danger text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <button
            className="primary-action w-full justify-center disabled:opacity-60"
            disabled={submitting || Boolean(configurationMessage)}
            type="submit"
          >
            {submitting ? "Memeriksa akun..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
