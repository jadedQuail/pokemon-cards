import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { logUserIn } from "./utils/login.js";
import { fillPokemonForm } from "./utils/pokemon.js";

import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.API_URL;
const ADMIN_USERNAME = process.env.TEST_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

test.describe("user lifecycle suite", () => {
    test("able to login and has admin privileges", async ({ page }) => {
        await logUserIn(page, ADMIN_USERNAME, ADMIN_PASSWORD);

        const addPokemonButton = page.getByTestId("add-pokemon-button");
        await expect(addPokemonButton).toBeVisible();

        const greetingHeader = page.getByTestId("greeting-header");
        await expect(greetingHeader).toHaveText(`Hello, ${ADMIN_USERNAME}`);
    });

    test("create, edit, then delete a pokemon", async ({ page }) => {
        // Login
        await logUserIn(page, ADMIN_USERNAME, ADMIN_PASSWORD);

        // Setup
        let shortId = randomUUID().split("-")[0];
        const pokemonCreateName = `TEST-${shortId}`;

        shortId = randomUUID().split("-")[0];
        const pokemonEditName = `TEST-${shortId}`;

        await page.getByTestId("add-pokemon-button").click();

        // Create
        await fillPokemonForm(
            page,
            pokemonCreateName,
            100,
            "While it is young, it uses the nutrients that are stored in the seed on its back in order to grow."
        );

        // Edit
        const searchInput = page.getByTestId("search-input");
        await searchInput.fill(pokemonCreateName);

        const editIcon = page.getByTestId("edit-pokemon-icon");
        await editIcon.click();

        await fillPokemonForm(
            page,
            pokemonEditName,
            200,
            "Some new flavor text, mmm!"
        );

        // Delete
        await searchInput.fill(pokemonEditName);

        const deleteIcon = page.getByTestId("delete-pokemon-icon");
        await deleteIcon.click();

        const deleteConfirmationButton = page.getByTestId(
            "delete-pokemon-button"
        );
        await deleteConfirmationButton.click();
    });

    test("create then delete a set", async ({ page }) => {
        // Login
        await logUserIn(page, ADMIN_USERNAME, ADMIN_PASSWORD);
    });
});
