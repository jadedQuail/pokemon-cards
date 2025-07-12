import { test, expect } from "@playwright/test";
import { logUserIn } from "./utils/login.js";

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
        await logUserIn(page, ADMIN_USERNAME, ADMIN_PASSWORD);

        const addPokemonButton = page.getByTestId("add-pokemon-button");
        await expect(addPokemonButton).toBeVisible();
    });
});
