import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";

import { RegisterFieldIds } from "~/static/constants.js";
import { SeverityLevels } from "~/static/constants.js";

let RegisterDialog;
let registerFieldsMock;

const createUserMock = vi.fn(() => ({ success: true }));
const hideRegisterDialogMock = vi.fn();
const showToastMock = vi.fn();

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    vi.stubGlobal("$fetch", vi.fn().mockResolvedValue({}));

    registerFieldsMock = {
        [RegisterFieldIds.Username]: {
            name: RegisterFieldIds.Username,
            content: "test-user",
            valid: true,
        },
        [RegisterFieldIds.Password]: {
            name: RegisterFieldIds.Password,
            content: "testUserPassword1#",
            valid: true,
        },
        [RegisterFieldIds.ConfirmPassword]: {
            name: RegisterFieldIds.ConfirmPassword,
            content: "testUserPassword1#",
            valid: true,
        },
    };

    vi.doMock("~/stores/authStore.js", () => ({
        useAuthStore: () => ({
            registerDialogVisible: true,
            registerFields: registerFieldsMock,
            hideRegisterDialog: hideRegisterDialogMock,
        }),
    }));

    vi.doMock("~/composables/useToastNotification", () => ({
        useToastNotifications: () => ({
            showToast: showToastMock,
        }),
    }));

    vi.doMock("@/services/apiClient/auth.js", () => ({
        createUser: createUserMock,
    }));

    const module = await import("~/components/RegisterDialog.vue");
    RegisterDialog = module.default;
});

test("calls the API client function to register the user upon submission", async () => {
    await renderSuspended(RegisterDialog);

    const registerButton = screen.getByTestId("register-button");
    await fireEvent.click(registerButton);

    await waitFor(() => {
        expect(createUserMock).toHaveBeenCalledTimes(1);
        expect(hideRegisterDialogMock).toHaveBeenCalledTimes(1);
        expect(showToastMock).toHaveBeenCalledWith(
            SeverityLevels.Success,
            "You've successfully created an account!",
            "You've also been logged in."
        );
    });
});

test("hides the register dialog when the user clicks cancel", async () => {
    await renderSuspended(RegisterDialog);

    const cancelButton = screen.getByTestId("cancel-register-button");
    await fireEvent.click(cancelButton);

    expect(hideRegisterDialogMock).toHaveBeenCalledTimes(1);
});

test("form does not submit when a required field is blank", async () => {
    registerFieldsMock[RegisterFieldIds.Username].content = "";

    await renderSuspended(RegisterDialog);

    const registerForm = screen.getByTestId("register-form");
    await fireEvent.submit(registerForm);

    expect(createUserMock).not.toHaveBeenCalled();
    expect(hideRegisterDialogMock).not.toHaveBeenCalled();
});
