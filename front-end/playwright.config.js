import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file.
    testDir: "e2e",

    // Run all tests in parallel.
    fullyParallel: true,

    // Opt out of parallel tests on CI.
    workers: 1,

    // Reporter to use
    reporter: "list",

    use: {
        // Base URL to use in actions like `await page.goto('/')`.
        baseURL: "http://localhost:3000",

        // Collect trace when retrying the failed test.
        trace: "on-first-retry",

        launchOptions: {
            slowMo: 1000,
        },
    },
    // Configure projects for major browsers.
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
