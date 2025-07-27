<template>
    <div v-if="authStore.isAuthInitialized">
        <Toast position="top-left" />
        <ConfirmDeletionDialog />
        <AddPokemonDialog />
        <CategoriesDialog />
        <LoginDialog />
        <LogoutDialog />
        <RegisterDialog />
        <TopBar
            @search-change="updateFilters"
            class="fixed top-0 left-0 w-full z-[100]"
        />
        <MainDataTable
            class="pt-16"
            :filters="filters"
            @update:filters="updateFilters"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";

import MainDataTable from "../components/MainDataTable.vue";
import TopBar from "../components/TopBar.vue";
import AddPokemonDialog from "../components/AddPokemonDialog.vue";
import ConfirmDeletionDialog from "../components/ConfirmDeletionDialog.vue";
import CategoriesDialog from "../components/CategoriesDialog.vue";
import LoginDialog from "../components/LoginDialog.vue";
import LogoutDialog from "../components/LogoutDialog.vue";
import RegisterDialog from "../components/RegisterDialog.vue";

// TODO: Update README to explain option to run front-end and back-end in dev at the same time via concurrently

import { useAuthStore } from "~/stores/authStore.js";

const authStore = useAuthStore();

const filters = ref({});

const updateFilters = (inputFilters) => {
    filters.value = inputFilters;
};
</script>
