import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;

export async function logUserIn(page, username, password) {
    console.log("Logging in to:", BASE_URL);

    await page.goto(BASE_URL);
    console.log("Page loaded");

    await page.getByTestId("login-logout-button").click();
    console.log("Clicked login button");

    await page.getByTestId("login-dialog-username").fill(username);
    console.log("Filled username");

    await page
        .getByTestId("login-dialog-password-parent")
        .locator("input")
        .fill(password);
    console.log("Filled password");

    await page.getByTestId("login-submit-button").click();
    console.log("Clicked submit");
}
