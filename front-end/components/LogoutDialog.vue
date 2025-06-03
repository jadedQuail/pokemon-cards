<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="authStore.logoutDialogVisible"
            :draggable="false"
            modal
            header="Logout"
            class="min-w-[350px] !w-[20vw]"
            :pt="{
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <p class="text-lg flex justify-center mb-10">
                Are you sure you want to log out?
            </p>
            <!-- Buttons -->
            <div class="flex justify-center items-center mt-4">
                <div class="flex justify-end gap-2">
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        @click="closeDialog"
                    ></Button>
                    <Button
                        type="submit"
                        label="Confirm"
                        @click="handleConfirmClick"
                    ></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore.js";

const config = useRuntimeConfig();

const authStore = useAuthStore();

const handleConfirmClick = () => {
    logUserOut();
    closeDialog();
};

const logUserOut = async () => {
    authStore.clearUser();
    await nextTick();
};

const closeDialog = () => {
    authStore.hideLogoutDialog();
};
</script>
