import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom";

import { LoginFieldIds } from "~/static/constants.js";

let LoginDialog;
let loginFieldsMock;

const logUserInMock = vi.fn(() => ({ success: true }));
const hideLoginDialogMock = vi.fn();

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    loginFieldsMock = {
        [LoginFieldIds.Username]: {
            name: LoginFieldIds.Username,
            content: "test-user",
            valid: true,
        },
        [LoginFieldIds.Password]: {
            name: LoginFieldIds.Password,
            content: "testUserPassword1#",
            valid: true,
        },
    };

    vi.doMock("~/stores/authStore.js", () => ({
        useAuthStore: () => ({
            loginDialogVisible: true,
            loginFields: loginFieldsMock,
            hideLoginDialog: hideLoginDialogMock,
        }),
    }));

    vi.doMock("@/services/apiClient/auth.js", () => ({
        logUserIn: logUserInMock,
    }));

    const module = await import("~/components/LoginDialog.vue");
    LoginDialog = module.default;
});

test("calls the API client function to log the user in upon submission", async () => {
    await renderSuspended(LoginDialog);

    const loginButton = screen.getByTestId("login-submit-button");
    await fireEvent.click(loginButton);

    expect(logUserInMock).toHaveBeenCalledTimes(1);
    expect(hideLoginDialogMock).toHaveBeenCalledTimes(1);
});

test("hides the login dialog when the user clicks cancel", async () => {
    await renderSuspended(LoginDialog);

    const cancelButton = screen.getByTestId("cancel-login-button");
    await fireEvent.click(cancelButton);

    expect(hideLoginDialogMock).toHaveBeenCalledTimes(1);
});

test("form does not submit when a required field is blank", async () => {
    loginFieldsMock[LoginFieldIds.Username].content = "";

    await renderSuspended(LoginDialog);

    const loginForm = screen.getByTestId("login-form");
    await fireEvent.submit(loginForm);

    expect(logUserInMock).not.toHaveBeenCalled();
    expect(hideLoginDialogMock).not.toHaveBeenCalled();
});
