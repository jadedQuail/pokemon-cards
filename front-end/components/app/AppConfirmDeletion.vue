<template>
    <Dialog
        v-model:visible="isVisible"
        modal
        :closable="false"
        :draggable="false"
    >
        <template #header>
            <div class="w-full flex justify-center">
                <span class="font-semibold text-2xl flex items-center"
                    >Confirmation</span
                >
            </div>
        </template>
        <span class="text-surface-500 dark:text-surface-400 block mb-8"
            >Please confirm you wish to delete the following item:</span
        >
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Username</label>
            <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="email" class="font-semibold w-24">Email</label>
            <InputText id="email" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button
                type="button"
                label="Cancel"
                severity="secondary"
                @click="isVisible = false"
            ></Button>
            <Button
                type="button"
                label="Delete"
                @click="isVisible = false"
            ></Button>
        </div>
    </Dialog>
</template>

<script setup>
import { useConfirmDialog } from "@/composables/useConfirmDialog";
const { isVisible, message } = useConfirmDialog();
</script>
