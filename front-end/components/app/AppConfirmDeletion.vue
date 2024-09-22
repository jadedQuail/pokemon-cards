<template>
    <Toast position="top-left" />
    <Dialog
        v-model:visible="isVisible"
        modal
        :closable="false"
        :draggable="false"
        class="min-w-[400px]"
    >
        <template #header>
            <div class="w-full flex justify-center">
                <span class="font-semibold text-2xl flex items-center">{{
                    message.header
                }}</span>
            </div>
        </template>

        <span class="text-surface-500 block mb-5">{{ message.message }}</span>

        <div class="grid grid-cols-[1fr,3fr] gap-y-1 items-center mb-5">
            <span class="font-bold">ID</span>
            <span>{{ currentPokemonData.ID }}</span>

            <span class="font-bold">Name</span>
            <span>{{ currentPokemonData.Name }}</span>

            <span class="font-bold">HP</span>
            <span>{{ currentPokemonData.HP }}</span>

            <span class="font-bold">Type</span>
            <span>{{ currentPokemonData.Type }}</span>

            <span class="font-bold">Set</span>
            <span>{{ currentPokemonData.Set }}</span>
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
                @click="deletePokemonHandler"
            ></Button>
        </div>
    </Dialog>
</template>

<script setup>
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { deletePokemon } from "@/services/apiCalls";
import { useStore } from "~/store/store.js";

import { useToast } from "primevue/usetoast";
const toast = useToast();

const { isVisible, message, currentPokemonData } = useConfirmDialog();
const store = useStore();
const config = useRuntimeConfig();

const showSuccess = () => {
    toast.add({
        severity: "info",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
    });
};

// TODO: Add a toast that tells the user when a delete/added pokemon has occurred successfully.
const deletePokemonHandler = async () => {
    try {
        const apiUrl = config.public.API_URL;
        const deleteId = currentPokemonData.value.ID;

        await deletePokemon(apiUrl, deleteId);
        await store.fetchPokemonData(apiUrl);
        isVisible.value = false;

        showSuccess();
    } catch (error) {
        console.error("Error deleting Pokémon:", error);
    }
};
</script>
