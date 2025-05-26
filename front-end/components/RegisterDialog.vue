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
                <!-- Username --->
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
                <!-- Password --->
                <!-- Confirm Password --->
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
</script>
