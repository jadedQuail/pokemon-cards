import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;

export async function logUserIn(page, username, password) {
    await page.goto(BASE_URL);
    await page.getByTestId("login-logout-button").click();
    await page.getByTestId("login-dialog-username").fill(username);
    await page
        .getByTestId("login-dialog-password-parent")
        .locator("input")
        .fill(password);
    await page.getByTestId("login-submit-button").click();
}
