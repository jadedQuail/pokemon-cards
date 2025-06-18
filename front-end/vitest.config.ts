import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
    test: {
        environment: "nuxt",
        globals: true,
        include: ["**/*.test.{ts,js}"],
        exclude: ["node_modules", "dist", "_nuxt"],
        setupFiles: ["./vitest.setup.ts"],
    },
});
