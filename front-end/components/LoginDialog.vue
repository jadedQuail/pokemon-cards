<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="store.loginDialogVisible"
            :draggable="false"
            modal
            header="Login"
            class="min-w-[500px] !w-[30vw]"
            @hide="closeDialog()"
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
                    <InputText />
                </div>
            </div>
            <!-- Password -->
            <div class="flex items-start gap-4 mb-4 mt-1">
                <label class="font-semibold w-24">Password</label>
                <div class="flex flex-col flex-auto">
                    <Password
                        :feedback="false"
                        :inputStyle="{ width: '100%' }"
                    />
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex justify-end gap-2">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                ></Button>
                <Button type="button" label="Login"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useStore } from "~/store/store.js";

const store = useStore();

const closeDialog = () => {
    store.hideLoginDialog();
};
</script>
