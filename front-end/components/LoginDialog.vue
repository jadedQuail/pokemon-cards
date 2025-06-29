<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="authStore.loginDialogVisible"
            :draggable="false"
            modal
            header="Login"
            class="min-w-[500px] !w-[30vw]"
            @show="dialogTools.clearFocus"
            @hide="resetForm"
            :pt="{
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <form data-testid="login-form" @submit.prevent="handleSubmit">
                <!-- Username -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label class="font-semibold w-24">Username</label>
                    <div class="flex flex-col flex-auto">
                        <InputText
                            v-model="fields[LoginFieldIds.Username].content"
                            :id="LoginFieldIds.Username"
                            class="w-full"
                            autocomplete="off"
                            :invalid="!fields[LoginFieldIds.Username].valid"
                            @update:model-value="
                                (value) => {
                                    userHasTypedAgain = true;
                                    resetLoginErrorState();
                                    setValidityFlagForField(
                                        value,
                                        fields[LoginFieldIds.Username]
                                    );
                                }
                            "
                        />
                        <small
                            v-if="!fields[LoginFieldIds.Username].valid"
                            class="text-red-500"
                        >
                            You must provide a username.
                        </small>
                    </div>
                </div>
                <!-- Password -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label class="font-semibold w-24">Password</label>
                    <div class="flex flex-col flex-auto">
                        <Password
                            v-model="fields[LoginFieldIds.Password].content"
                            :id="LoginFieldIds.Password"
                            :feedback="false"
                            autocomplete="off"
                            :inputStyle="{ width: '100%' }"
                            :invalid="!fields[LoginFieldIds.Password].valid"
                            @update:model-value="
                                (value) => {
                                    userHasTypedAgain = true;
                                    resetLoginErrorState();
                                    setValidityFlagForField(
                                        value,
                                        fields[LoginFieldIds.Password]
                                    );
                                }
                            "
                        />
                        <small
                            v-if="!fields[LoginFieldIds.Password].valid"
                            class="text-red-500"
                        >
                            You must provide a password.
                        </small>
                    </div>
                </div>
                <!-- TODO: A feature flag to turn off Turnstile locally, because of my internet issues -->
                <div
                    v-if="loginError.hasError && !userHasTypedAgain"
                    class="text-red-500"
                >
                    {{ loginError.message }}
                </div>
                <!-- Buttons -->
                <div class="flex justify-between items-center mt-4">
                    <div>
                        New user?
                        <span
                            class="text-blue-500 underline hover:text-blue-700 cursor-pointer"
                            @click="handleRegisterClick"
                        >
                            Click here to register</span
                        >
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button
                            data-testid="cancel-login-button"
                            type="button"
                            label="Cancel"
                            severity="secondary"
                            @click="closeDialog"
                        ></Button>
                        <Button
                            data-testid="login-submit-button"
                            type="submit"
                            label="Login"
                        ></Button>
                    </div>
                </div>
                <NuxtTurnstile v-model="turnstileToken" />
            </form>
        </Dialog>
    </div>
</template>

<script setup>
// TODO: Make this a TypeScript project

import { onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore.js";
import { LoginFieldIds } from "~/static/constants.js";
import { logUserIn } from "@/services/apiClient/auth.js";
import { useDialogTools } from "~/composables/useDialogTools.js";

const config = useRuntimeConfig();

const authStore = useAuthStore();
const dialogTools = useDialogTools();

const fields = ref(authStore.loginFields);

const loginError = reactive({
    hasError: false,
    message: "",
});

const userHasTypedAgain = ref(false);

const turnstileToken = ref("");

const resetForm = () => {
    resetValidationFlags();
    resetFieldContent();
    resetLoginErrorState();
};

const resetValidationFlags = () => {
    for (const key in fields.value) {
        if (fields.value.hasOwnProperty(key)) {
            fields.value[key].valid = true;
        }
    }
};

const resetFieldContent = () => {
    for (const key in fields.value) {
        if (fields.value.hasOwnProperty(key)) {
            fields.value[key].content = "";
        }
    }
};

const resetLoginErrorState = () => {
    loginError.hasError = false;
    loginError.message = "";
};

const setValidityFlagForField = (value, field) => {
    if (value.length < 1) {
        field.valid = false;
    } else {
        field.valid = true;
    }
};

const setValidityFlagForAllFields = () => {
    for (const key in fields.value) {
        const field = fields.value[key];
        setValidityFlagForField(field.content, field);
    }
};

const areAllFieldsValid = () => {
    for (const key in fields.value) {
        if (fields.value[key].valid === false) {
            return false;
        }
    }

    return true;
};

const handleSubmit = async () => {
    userHasTypedAgain.value = false;

    setValidityFlagForAllFields();

    const formReady = areAllFieldsValid();

    if (formReady) {
        try {
            await validateThroughTurnstile();
        } catch {
            loginError.hasError = true;
            loginError.message =
                "An unexpected error occurred. Please try again.";
            return;
        }

        const loginSucceeded = await submitLoginHandler();
        if (loginSucceeded) {
            closeDialog();
        }
    }
};

async function validateThroughTurnstile() {
    const data = await $fetch("/api/validateTurnstile", {
        method: "POST",
        body: {
            token: turnstileToken.value,
        },
    });
}

const submitLoginHandler = async () => {
    try {
        const apiUrl = config.public.API_URL;

        const username = fields.value[LoginFieldIds.Username].content;
        const password = fields.value[LoginFieldIds.Password].content;

        const result = await logUserIn(apiUrl, username, password);

        setLoginErrorState(result);

        return result && result.success;
    } catch (error) {
        loginError.value = true;
        loginError.message = "An unexpected error occurred. Please try again.";
        return false;
    }
};

const setLoginErrorState = (loginAttemptResult) => {
    loginError.hasError = !(loginAttemptResult && loginAttemptResult.success);
    loginError.message = loginError.hasError
        ? loginAttemptResult?.message ||
          "An unexpected error occurred. Please try again."
        : "";
};

const handleRegisterClick = () => {
    closeDialog();
    authStore.showRegisterDialog();
};

const closeDialog = () => {
    authStore.hideLoginDialog();
};
</script>
