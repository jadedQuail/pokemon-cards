<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="store.registerDialogVisible"
            :draggable="false"
            modal
            header="Register"
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
                            v-model="fields[RegisterFieldIds.Username].content"
                            :id="RegisterFieldIds.Username"
                            class="w-full"
                            autocomplete="off"
                            :invalid="!fields[RegisterFieldIds.Username].valid"
                            @update:model-value="
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[RegisterFieldIds.Username]
                                    )
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
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[RegisterFieldIds.Password]
                                    )
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
                                (value) =>
                                    setValidityFlagForField(
                                        value,
                                        fields[RegisterFieldIds.ConfirmPassword]
                                    )
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
                <!-- Buttons -->
                <div class="flex justify-end gap-2">
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="closeDialog"
                    ></Button>
                    <Button
                        type="button"
                        label="Save"
                        @click="handleSubmit"
                    ></Button>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "~/store/store.js";
import { RegisterFieldIds } from "~/static/constants.js";

const config = useRuntimeConfig();

const store = useStore();

const fields = ref(store.registerFields);

const confirmPasswordErrorMessage = ref("");

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

const handleSubmit = () => {
    setValidityFlagForAllFields();

    const formReady = areAllFieldsValid();

    if (formReady) {
        console.log("Successful submission");
    }
};

const closeDialog = () => {
    store.hideRegisterDialog();
};
</script>
