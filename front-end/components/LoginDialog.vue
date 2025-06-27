<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="authStore.loginDialogVisible"
            :draggable="false"
            modal
            header="Login"
            class="min-w-[500px] !w-[30vw]"
            @hide="resetForm"
            :pt="{
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <!-- TODO: Hitting 'enter' key on totally empty field closes the dialog instead of doing nothing; it's because of an auto-focus on the X button upon the dialog opening -->
            <form @submit.prevent="handleSubmit">
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
                <div
                    v-if="loginError && !userHasTypedAgain"
                    class="text-red-500"
                >
                    Your username or password is incorrect. Please try again!
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
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore.js";

import { LoginFieldIds } from "~/static/constants.js";

import { logUserIn } from "@/services/apiClient/auth.js";

const config = useRuntimeConfig();

const authStore = useAuthStore();

const fields = ref(authStore.loginFields);

const loginError = ref(false);

const userHasTypedAgain = ref(false);

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
    loginError.value = false;
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
        const loginSucceeded = await submitLoginHandler();
        console.log("Yeppers");
        if (loginSucceeded) {
            closeDialog();
        }
    }
};

const submitLoginHandler = async () => {
    try {
        const apiUrl = config.public.API_URL;

        const username = fields.value[LoginFieldIds.Username].content;
        const password = fields.value[LoginFieldIds.Password].content;

        const result = await logUserIn(apiUrl, username, password);

        setLoginErrorState(result);

        return result && result.success;
    } catch (error) {
        console.error("Error logging in:", error);
        loginError.value = true;
        return false;
    }
};

const setLoginErrorState = (loginAttemptResult) => {
    loginError.value = !(loginAttemptResult && loginAttemptResult.success);
};

const handleRegisterClick = () => {
    closeDialog();
    authStore.showRegisterDialog();
};

const closeDialog = () => {
    authStore.hideLoginDialog();
};
</script>
