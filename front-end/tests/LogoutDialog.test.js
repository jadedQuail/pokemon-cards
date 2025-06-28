import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom";

let LogoutDialog;

const clearUserMock = vi.fn();
const hideLogoutDialogMock = vi.fn();

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    vi.doMock("~/stores/authStore.js", () => ({
        useAuthStore: () => ({
            logoutDialogVisible: true,
            clearUser: clearUserMock,
            hideLogoutDialog: hideLogoutDialogMock,
        }),
    }));

    const module = await import("~/components/LogoutDialog.vue");
    LogoutDialog = module.default;
});

test("clears the user and closes the dialog upon user clicking log out", async () => {
    await renderSuspended(LogoutDialog);

    const logoutButton = screen.getByTestId("logout-submit-button");
    await fireEvent.click(logoutButton);

    expect(clearUserMock).toHaveBeenCalledTimes(1);
    expect(hideLogoutDialogMock).toHaveBeenCalledTimes(1);
});

test("hides the logout dialog when the user clicks cancel", async () => {
    await renderSuspended(LogoutDialog);

    const cancelButton = screen.getByTestId("cancel-logout-button");
    await fireEvent.click(cancelButton);

    expect(hideLogoutDialogMock).toHaveBeenCalledTimes(1);
});
