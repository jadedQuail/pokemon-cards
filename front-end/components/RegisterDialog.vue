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
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "~/store/store.js";

const config = useRuntimeConfig();

const store = useStore();
</script>
