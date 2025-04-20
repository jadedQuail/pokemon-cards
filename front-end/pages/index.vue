<template>
    <div>
        <Toast position="top-left" />
        <AppConfirmDeletion />
        <AppAddPokemonDialog />
        <TopBar
            @search-change="updateFilters"
            class="fixed top-0 left-0 w-full z-[100]"
        />
        <AppDataTable
            class="pt-16"
            :filters="filters"
            @update:filters="updateFilters"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";

import AppDataTableVue from "../components/app/AppDataTable.vue";
import TopBar from "../components/app/TopBar.vue";
import AppAddPokemonDialog from "../components/app/AppAddPokemonDialog.vue";
import AppConfirmDeletionVue from "../components/app/AppConfirmDeletion.vue";

const filters = ref({});

const updateFilters = (inputFilters) => {
    filters.value = inputFilters;
};
</script>
