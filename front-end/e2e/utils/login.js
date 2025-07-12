export async function logUserIn(page, username, password) {
    await page.goto("http://localhost:3000");
    await page.getByTestId("login-logout-button").click();
    await page.getByTestId("login-dialog-username").fill(username);
    await page
        .getByTestId("login-dialog-password-parent")
        .locator("input")
        .fill(password);
    await page.getByTestId("login-submit-button").click();
}
