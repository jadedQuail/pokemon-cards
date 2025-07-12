import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.API_URL;
const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

test.describe("user lifecycle suite", () => {
    let adminToken;

    test.beforeAll(async ({ request }) => {
        const loginResponse = await request.post(`${API_URL}/auth/login`, {
            data: {
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD,
            },
        });
        expect(loginResponse.status()).toBe(200);
        const { token } = await loginResponse.json();
        adminToken = token;
    });

    test("able to login", async ({ page }) => {
        await page.goto("http://localhost:3000");

        await page.getByTestId("login-logout-button").click();

        await page.getByTestId("login-dialog-username").fill(ADMIN_USERNAME);
        await page
            .getByTestId("login-dialog-password-parent")
            .locator("input")
            .fill(ADMIN_PASSWORD);
    });
});
