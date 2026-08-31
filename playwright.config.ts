import { defineConfig, devices } from "@playwright/test";

const port = 4323;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm exec astro dev --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}/style-guide`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
