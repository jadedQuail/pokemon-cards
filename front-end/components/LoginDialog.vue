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
            :pt="{
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
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
            <div class="flex justify-end gap-2">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    @click="closeDialog"
                ></Button>
                <Button
                    type="button"
                    label="Login"
                    @click="handleSubmit"
                ></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "~/store/store.js";
import { LoginFieldIds } from "~/static/constants.js";

const store = useStore();

const fields = ref(store.loginFields);

const handleSubmit = async () => {
    setValidityFlagForAllFields();

    const formReady = areAllFieldsValid();

    if (formReady) {
        await submitLoginHandler();
        closeDialog();
    }
};

const closeDialog = () => {
    store.hideLoginDialog();
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

const submitLoginHandler = async () => {
    console.log("We made it, baby!");
};

onMounted(async () => {
    console.log(fields.value);
});
</script>
