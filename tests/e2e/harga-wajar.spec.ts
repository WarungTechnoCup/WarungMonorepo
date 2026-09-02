import { expect, test } from "@playwright/test";

const backendConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
  process.env.DATABASE_URL,
);
const demoCredentialsConfigured = Boolean(
  process.env.E2E_DEMO_EMAIL && process.env.E2E_DEMO_PASSWORD,
);

test.describe("Harga Wajar database flow", () => {
  test.skip(
    !backendConfigured,
    "Requires migrated and seeded Supabase development database",
  );

  test("search shows available and below-threshold benchmark states", async ({
    page,
  }) => {
    await page.goto("/cek-harga");
    await expect(
      page.getByRole("button", { name: /Indomie Goreng/ }),
    ).toBeVisible();
    await expect(page.getByText("Harga wajar area")).toBeVisible();

    await page.getByRole("button", { name: /Minyak Goreng/ }).click();
    await expect(page.getByText("Belum cukup data")).toBeVisible();
    await expect(page.getByText("3 dari 5")).toBeVisible();
  });

  test("signed-in user previews, submits, and sees a price report", async ({
    page,
  }) => {
    test.skip(
      !demoCredentialsConfigured,
      "Requires E2E demo account credentials",
    );

    await page.goto("/lapor-harga");
    await expect(page).toHaveURL(/\/masuk/);
    await page.getByLabel("Email").fill(process.env.E2E_DEMO_EMAIL!);
    await page.getByLabel("Kata sandi").fill(process.env.E2E_DEMO_PASSWORD!);
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page).toHaveURL(/\/lapor-harga/);

    await page.getByRole("button", { name: "Lanjutkan" }).click();
    await page.getByLabel("Harga kotor total").fill("118000");
    await page.getByLabel("Biaya kirim").fill("5000");
    await page.getByRole("button", { name: "Lanjutkan" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Tinjau perhitungan" }).click();
    await expect(page.getByText("Rp3.075")).toBeVisible();
    await page.getByRole("button", { name: "Kirim laporan" }).click();

    await expect(page).toHaveURL(/\/lapor-harga\/sukses/);
    await expect(
      page.getByRole("heading", { name: /Terima kasih/ }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Lihat aktivitas" }).click();
    await expect(page.getByText("Indomie Goreng 85g").first()).toBeVisible();
  });
});
