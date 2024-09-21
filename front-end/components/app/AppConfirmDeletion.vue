<template>
    <ConfirmDialog group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div
                class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded"
            >
                <span class="font-bold text-2xl block mb-2">{{
                    message.header
                }}</span>
                <p class="mb-0">{{ message.message }}</p>
                <div class="flex items-center gap-2 mt-6">
                    <Button
                        label="Save"
                        @click="acceptCallback"
                        class="w-32"
                    ></Button>
                    <Button
                        label="Cancel"
                        outlined
                        @click="rejectCallback"
                        class="w-32"
                    ></Button>
                </div>
            </div>
        </template>
    </ConfirmDialog>
</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";
import { onMounted } from "vue";

// I had to do this because of a PrimeVue v4 bug, just renamed confirm.require() to confirmRequire()
const { require: confirmRequire } = useConfirm();

const confirmDelete = () => {
    confirmRequire({
        group: "headless",
        header: "Are you sure?",
        message: "Please confirm to proceed.",
        accept: () => {},
        reject: () => {},
    });
};

onMounted(() => {
    confirmDelete();
});
</script>
