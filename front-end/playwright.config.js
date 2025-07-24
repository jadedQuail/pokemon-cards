import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "e2e",
    fullyParallel: true,
    workers: 1,
    reporter: "list",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        launchOptions: {
            slowMo: 0,
        },
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
