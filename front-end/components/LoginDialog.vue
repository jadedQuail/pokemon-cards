<!-- 
    TODO: I think I could take this component and the AddPokemonDialog.vue component and create a base "form" component out of them
    Ask ChatGPT about this!
-->

<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="store.loginDialogVisible"
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
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[LoginFieldIds.Username]
                                    )
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
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[LoginFieldIds.Password]
                                    )
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
                <!-- Buttons -->
                <div class="flex justify-between items-center mt-4">
                    <div>
                        New user?
                        <a href="#" class="text-blue-500">
                            Click here to register</a
                        >
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button
                            type="button"
                            label="Cancel"
                            severity="secondary"
                            @click="closeDialog"
                        ></Button>
                        <Button type="submit" label="Login"></Button>
                    </div>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "~/store/store.js";
import { LoginFieldIds } from "~/static/constants.js";

import { logUserIn } from "@/services/apiCalls";

const config = useRuntimeConfig();

const store = useStore();

const fields = ref(store.loginFields);

const resetForm = () => {
    resetValidationFlags();
    resetFieldContent();
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
    setValidityFlagForAllFields();

    const formReady = areAllFieldsValid();

    if (formReady) {
        await submitLoginHandler();
        closeDialog();
    }
};

const submitLoginHandler = async () => {
    try {
        const apiUrl = config.public.API_URL;

        const username = fields.value[LoginFieldIds.Username].content;
        const password = fields.value[LoginFieldIds.Password].content;

        const result = await logUserIn(apiUrl, username, password);
    } catch (error) {
        console.error("Error logging in:", error);
    }
};

const closeDialog = () => {
    store.hideLoginDialog();
};

onMounted(async () => {
    console.log(fields.value);
});
</script>
