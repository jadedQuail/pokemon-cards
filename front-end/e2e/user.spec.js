import { test, expect } from "@playwright/test";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.API_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const USERNAME = "AfGk3LmN75";
const PASSWORD = "Welcome2025!";

test.describe("user lifecycle suite", () => {
    let userId;

    test.beforeAll(async ({ request }) => {
        // Create User
        const createRes = await request.post(`${API_URL}/auth/create-user`, {
            data: {
                username: USERNAME,
                password: PASSWORD,
                confirmPassword: PASSWORD,
            },
        });
        expect(createRes.status()).toBe(201);

        // Log User In
        const loginRes = await request.post(`${API_URL}/auth/login`, {
            data: {
                username: USERNAME,
                password: PASSWORD,
            },
        });
        expect(loginRes.status()).toBe(200);
        const { token } = await loginRes.json();

        const decoded = jwt.decode(token);
        userId = decoded.id;
    });

    test("able to login", async ({ page }) => {
        await page.goto("http://localhost:3000");

        await page.getByTestId("login-logout-button").click();

        await page.getByTestId("login-dialog-username").fill(USERNAME);
        await page
            .getByTestId("login-dialog-password-parent")
            .locator("input")
            .fill(PASSWORD);
    });

    test.afterAll(async ({ request }) => {
        const deleteRes = await request.delete(
            `${API_URL}/auth/delete/${userId}`,
            { headers: { "x-api-key": ADMIN_API_KEY } }
        );
        expect(deleteRes.status()).toBe(204);
    });
});
