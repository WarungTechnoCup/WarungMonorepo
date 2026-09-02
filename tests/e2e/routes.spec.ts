import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/masuk",
  "/cek-harga",
  "/produk/minyak-goreng-1-l",
  "/kulakan-bareng",
  "/kulakan-bareng/scaffold-001",
  "/cara-kerja",
  "/privasi",
  "/offline",
];

const protectedRoutes = [
  "/lapor-harga",
  "/lapor-harga/sukses",
  "/aktivitas",
  "/passport",
  "/admin",
];

for (const route of publicRoutes) {
  test(`${route} renders an honest route shell`, async ({ page }) => {
    await page.goto(route);

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Create Next App");

    const horizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBe(false);
  });
}

for (const route of protectedRoutes) {
  test(`${route} fails closed when unauthenticated`, async ({ page }) => {
    await page.goto(route);

    await expect(page).toHaveURL(/\/masuk\?status=(konfigurasi|autentikasi)/);

    if (new URL(page.url()).searchParams.get("status") === "konfigurasi") {
      await expect(
        page.getByText("Supabase belum dikonfigurasi"),
      ).toBeVisible();
    }
  });
}

test("home route has no automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
