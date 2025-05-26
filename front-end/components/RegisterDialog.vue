<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="store.registerDialogVisible"
            :draggable="false"
            modal
            header="Register"
            class="min-w-[500px] !w-[30vw]"
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
                            You must type your password again
                        </small>
                        <!-- TODO: Need this error message to be dynamic based on whether this is blank or doesn't match the password -->
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

const setValidityFlagForField = (value, field) => {
    if (value.length < 1) {
        field.valid = false;
    } else {
        field.valid = true;
    }
};

const handleSubmit = () => {};

const closeDialog = () => {
    store.hideRegisterDialog();
};
</script>
