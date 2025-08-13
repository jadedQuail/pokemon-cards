<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="authStore.registerDialogVisible"
            :draggable="false"
            modal
            header="Register"
            class="min-w-[500px] !w-[30vw]"
            @show="dialogTools.clearFocus"
            @hide="resetForm"
            :pt="{
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <form data-testid="register-form" @submit.prevent="handleSubmit">
                <!-- Username -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label class="font-semibold w-24">Username</label>
                    <div class="flex flex-col flex-auto">
                        <InputText
                            v-model="fields[RegisterFieldIds.Username].content"
                            :id="RegisterFieldIds.Username"
                            class="w-full"
                            autocomplete="off"
                            :invalid="!fields[RegisterFieldIds.Username].valid"
                            @update:model-value="
                                (value) => {
                                    userHasTypedAgain = true;
                                    resetRegistrationErrorState();
                                    setValidityFlagForField(
                                        value,
                                        fields[RegisterFieldIds.Username]
                                    );
                                }
                            "
                        />
                        <small
                            v-if="!fields[RegisterFieldIds.Username].valid"
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
                            v-model="fields[RegisterFieldIds.Password].content"
                            :id="RegisterFieldIds.Password"
                            :feedback="false"
                            autocomplete="off"
                            :inputStyle="{ width: '100%' }"
                            :invalid="!fields[RegisterFieldIds.Password].valid"
                            @update:model-value="
                                (value) => {
                                    userHasTypedAgain = true;
                                    resetRegistrationErrorState();
                                    setValidityFlagForField(
                                        value,
                                        fields[RegisterFieldIds.Password]
                                    );
                                }
                            "
                        />
                        <small
                            v-if="!fields[RegisterFieldIds.Password].valid"
                            class="text-red-500"
                        >
                            You must provide a password.
                        </small>
                    </div>
                </div>
                <!-- Confirm Password -->
                <div class="flex items-start gap-4 mb-4 mt-1">
                    <label class="font-semibold w-24">Confirm Password</label>
                    <div class="flex flex-col flex-auto">
                        <Password
                            v-model="
                                fields[RegisterFieldIds.ConfirmPassword].content
                            "
                            :id="RegisterFieldIds.Password"
                            :feedback="false"
                            autocomplete="off"
                            :inputStyle="{ width: '100%' }"
                            :invalid="
                                !fields[RegisterFieldIds.ConfirmPassword].valid
                            "
                            @update:model-value="
                                (value) => {
                                    userHasTypedAgain = true;
                                    resetRegistrationErrorState();
                                    setValidityFlagForField(
                                        value,
                                        fields[RegisterFieldIds.ConfirmPassword]
                                    );
                                }
                            "
                        />
                        <small
                            v-if="
                                !fields[RegisterFieldIds.ConfirmPassword].valid
                            "
                            class="text-red-500"
                        >
                            {{ confirmPasswordErrorMessage }}
                        </small>
                    </div>
                </div>
                <!-- Error Message -->
                <RegistrationErrorMessage
                    v-if="registrationError && !userHasTypedAgain"
                    :registrationErrorCode="registrationErrorCode"
                />
                <NuxtTurnstile
                    class="mt-2"
                    v-model="turnstileToken"
                    v-if="enableTurnstile"
                    :options="{ theme: 'light' }"
                />
                <!-- Buttons -->
                <div class="flex justify-end gap-2 mt-4">
                    <Button
                        data-testid="cancel-register-button"
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="closeDialog"
                    ></Button>
                    <Button
                        data-testid="register-button"
                        type="submit"
                        label="Register"
                    ></Button>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/authStore.js";
import { useDialogTools } from "~/composables/useDialogTools.js";

import { RegistrationErrorCodes } from "../../shared/errorCodes";
import { RegisterFieldIds, SeverityLevels } from "~/static/constants.js";
import { useToastNotifications } from "@/composables/useToastNotification";
import { createUser, logUserIn } from "@/services/apiClient/auth.js";
import RegistrationErrorMessage from "@/components/RegistrationErrorMessage.vue";

const dialogTools = useDialogTools();

const config = useRuntimeConfig();

const authStore = useAuthStore();

const { showToast } = useToastNotifications();

const fields = ref(authStore.registerFields);

const registrationError = ref(false);
const registrationErrorCode = ref(null);

const confirmPasswordErrorMessage = ref("");

const userHasTypedAgain = ref(false);

const turnstileToken = ref("");

const enableTurnstile = computed(() => config.public.ENABLE_TURNSTILE);

const resetForm = () => {
    resetValidationFlags();
    resetFieldContent();
    resetRegistrationErrorState();
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

const resetRegistrationErrorState = () => {
    registrationError.value = false;
};

const setValidityFlagForField = (value, field) => {
    if (field.name === RegisterFieldIds.ConfirmPassword) {
        if (value.length < 1) {
            field.valid = false;
            confirmPasswordErrorMessage.value =
                "You must type your password again.";
        } else if (value != fields.value[RegisterFieldIds.Password].content) {
            field.valid = false;
            confirmPasswordErrorMessage.value = "Passwords must match.";
        } else {
            field.valid = true;
        }
    } else {
        if (value.length < 1) {
            field.valid = false;
        } else {
            field.valid = true;
        }
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
    clearRegistrationErrorCode();

    setValidityFlagForAllFields();

    const formReady = areAllFieldsValid();

    if (formReady) {
        const registrationSucceeded = await submitRegistrationHandler();
        if (registrationSucceeded) {
            showToast(
                SeverityLevels.Success,
                "You've successfully created an account!",
                "You've also been logged in."
            );
            logUserInAfterRegistration();
            closeDialog();
        }
    }
};

const logUserInAfterRegistration = async () => {
    const username = fields.value[RegisterFieldIds.Username].content;
    const password = fields.value[RegisterFieldIds.Password].content;

    try {
        await logUserIn(username, password);
    } catch (error) {
        console.error("Error logging user in after registering:", error);
    }
};

const submitRegistrationHandler = async () => {
    try {
        const username = fields.value[RegisterFieldIds.Username].content;
        const password = fields.value[RegisterFieldIds.Password].content;
        const confirmPassword =
            fields.value[RegisterFieldIds.ConfirmPassword].content;

        if (enableTurnstile.value) {
            try {
                await validateThroughTurnstile();
            } catch {
                setRegistrationErrorState({ success: false });
                setRegistrationErrorCode(
                    RegistrationErrorCodes.TURNSTILE_ERROR
                );
                return false;
            }
        }

        const result = await createUser(username, password, confirmPassword);

        setRegistrationErrorState(result);
        setRegistrationErrorCode(result.errorCode);

        return result && result.success;
    } catch (error) {
        console.error("Error registering:", error);
    }
};

const setRegistrationErrorCode = (code) => {
    registrationErrorCode.value = code;
};

const clearRegistrationErrorCode = () => {
    registrationErrorCode.value = null;
};

const setRegistrationErrorState = (registrationAttemptResult) => {
    registrationError.value = !(
        registrationAttemptResult && registrationAttemptResult.success
    );
};

const closeDialog = () => {
    authStore.hideRegisterDialog();
};

async function validateThroughTurnstile() {
    const BASE_URL = config.public.BASE_URL;

    await $fetch(`${BASE_URL}/auth/validate-turnstile`, {
        method: "POST",
        body: {
            token: turnstileToken.value,
        },
    });
}
</script>
