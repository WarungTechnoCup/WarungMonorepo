import { existsSync, readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const localEnvPath = ".env.local";

if (existsSync(localEnvPath)) {
  for (const line of readFileSync(localEnvPath, "utf8").split("\n")) {
    const separator = line.indexOf("=");

    if (separator <= 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();

    if (!key.startsWith("#") && process.env[key] === undefined) {
      process.env[key] = line.slice(separator + 1).trim();
    }
  }
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-360",
      use: {
        browserName: "chromium",
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "node ./node_modules/next/dist/bin/next dev",
    url: "http://127.0.0.1:3000/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
