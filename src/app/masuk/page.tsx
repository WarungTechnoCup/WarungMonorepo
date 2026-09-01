import { ScaffoldPage } from "@/components/scaffold-page";

interface SignInPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { status } = await searchParams;
  const configurationMessage =
    status === "konfigurasi"
      ? "Supabase belum dikonfigurasi. Tim pengembang perlu mengisi .env.local sebelum autentikasi dapat digunakan."
      : undefined;

  return (
    <ScaffoldPage
      description="Rute autentikasi sudah tersedia, tetapi formulir dan akun demo baru akan dibuat setelah sumber daya Supabase disiapkan."
      eyebrow="Akses akun"
      plannedItems={[
        "Masuk dengan email dan kata sandi melalui Supabase Auth.",
        "Pertahankan tujuan awal pengguna setelah proses autentikasi.",
        "Tampilkan kesalahan dalam Bahasa Indonesia tanpa membocorkan detail sistem.",
      ]}
      privacyNote={configurationMessage}
      title="Masuk untuk berkontribusi."
    />
  );
}
