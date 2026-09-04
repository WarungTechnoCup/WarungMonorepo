import { createClient } from "@supabase/supabase-js";
import { createDatabaseConnection } from "../src/db/client";
import { warungs } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function createDemoUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus di-set di environment variables untuk menjalankan script ini."
    );
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const email = "demo@warungcekharga.com";
  const password = "password123!";

  console.log(`Membuat demo user: ${email}...`);

  let authUserId: string;

  // Cek apakah user sudah ada
  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error("Gagal melihat daftar user:", listError.message);
    process.exit(1);
  }

  const existingUser = usersData.users.find((u) => u.email === email);
  
  if (existingUser) {
    console.log(`User ${email} sudah ada dengan ID: ${existingUser.id}`);
    authUserId = existingUser.id;
  } else {
    const { data: createUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
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

    console.log("Selesai. Anda dapat masuk dengan:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
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
