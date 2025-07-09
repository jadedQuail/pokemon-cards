import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file.
    testDir: "e2e",

    // Run all tests in parallel.
    fullyParallel: true,

    // Opt out of parallel tests on CI.
    workers: 2,

    // Reporter to use
    reporter: "html",

    use: {
        // Base URL to use in actions like `await page.goto('/')`.
        baseURL: "http://localhost:3000",

        // Collect trace when retrying the failed test.
        trace: "on-first-retry",
    },
    // Configure projects for major browsers.
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
