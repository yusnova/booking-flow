import { defineConfig, devices } from "@playwright/test";
import { configEnv } from "./common/config/config";

const webServerBlock = {
  webServer: {
    command: configEnv.webServerCommand,
    cwd: configEnv.uiProjectDir,
    url: configEnv.webServerUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
};

export default defineConfig({
  testDir: "./playwright/tests",
  testMatch: "**/*.ui.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 35_000,
  expect: { timeout: 15_000 },
  reporter: [
    ["html", { outputFolder: "report", open: "never" }],
  ],
  use: {
    baseURL: configEnv.baseURL,
    headless: false,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [{ name: "ui", use: { ...devices["Desktop Chrome"] } }],
  ...webServerBlock,
});
