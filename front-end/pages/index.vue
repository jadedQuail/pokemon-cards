<template>
    <div>
        <Toast position="top-left" />
        <ConfirmDeletionDialog />
        <AddPokemonDialog />
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

import MainDataTable from "../components/app/MainDataTable.vue";
import TopBar from "../components/app/TopBar.vue";
import AddPokemonDialog from "../components/app/AddPokemonDialog.vue";
import ConfirmDeletionDialog from "../components/app/ConfirmDeletionDialog.vue";

const filters = ref({});

const updateFilters = (inputFilters) => {
    filters.value = inputFilters;
};
</script>
