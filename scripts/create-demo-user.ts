import "./load-env";

import { createClient } from "@supabase/supabase-js";
import { createDatabaseConnection } from "../src/db/client";
import { warungs } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function createDemoUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.E2E_DEMO_EMAIL;
  const password = process.env.E2E_DEMO_PASSWORD;

  if (!supabaseUrl || !serviceRoleKey || !email || !password) {
    console.error(
      "Error: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, E2E_DEMO_EMAIL, dan E2E_DEMO_PASSWORD harus diisi di .env.local.",
    );
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Membuat demo user: ${email}...`);

  let authUserId: string;

  const { data: usersData, error: listError } =
    await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error("Gagal melihat daftar user:", listError.message);
    process.exit(1);
  }

  const existingUser = usersData.users.find((u) => u.email === email);

  if (existingUser) {
    console.log(`User ${email} sudah ada dengan ID: ${existingUser.id}`);
    authUserId = existingUser.id;
  } else {
    const { data: createUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError) {
      console.error("Gagal membuat demo user:", createError.message);
      process.exit(1);
    }

    console.log(`Berhasil membuat demo user dengan ID: ${createUser.user.id}`);
    authUserId = createUser.user.id;
  }

  console.log("Menyiapkan profil warung...");
  const { db, close } = createDatabaseConnection();

  try {
    const existingWarung = await db
      .select()
      .from(warungs)
      .where(eq(warungs.ownerAuthUserId, authUserId));

    if (existingWarung.length > 0) {
      console.log("Profil warung sudah ada untuk user ini.");
    } else {
      await db.insert(warungs).values({
        ownerAuthUserId: authUserId,
        displayName: "Warung Demo",
        province: "DKI Jakarta",
        city: "Jakarta Barat",
        district: "Kebon Jeruk",
        isDemo: true,
      });
      console.log("Profil warung demo berhasil dibuat.");
    }

    console.log(`Selesai. Akun demo ${email} siap digunakan.`);
  } catch (error) {
    console.error("Gagal memasukkan profil warung:", error);
  } finally {
    await close();
  }
}

createDemoUser().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
