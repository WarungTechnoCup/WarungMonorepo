import { SignInForm } from "@/components/sign-in-form";

interface SignInPageProps {
  searchParams: Promise<{ status?: string; next?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { status, next } = await searchParams;
  const configurationMessage =
    status === "konfigurasi"
      ? "Supabase belum dikonfigurasi. Tim pengembang perlu mengisi .env.local sebelum autentikasi dapat digunakan."
      : undefined;
  const authenticationMessage =
    status === "autentikasi"
      ? "Sesi kamu belum aktif atau sudah berakhir. Masuk kembali untuk melanjutkan."
      : undefined;
  const nextPath =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/lapor-harga";

  return (
    <SignInForm
      authenticationMessage={authenticationMessage}
      configurationMessage={configurationMessage}
      nextPath={nextPath}
    />
  );
}
