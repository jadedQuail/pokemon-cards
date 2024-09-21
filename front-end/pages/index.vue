<template>
    <div>
        <AppConfirmDeletion />
        <AppAddPokemonDialog
            :visible="showAddPokemonDialog"
            @closing-dialog="closeAddPokemonForm"
        />
        <AppTopBar
            @search-change="updateFilters"
            @add-pokemon="openAddPokemonForm"
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
import AppTopBar from "../components/app/AppTopBar.vue";
import AppAddPokemonDialog from "../components/app/AppAddPokemonDialog.vue";
import AppConfirmDeletionVue from "../components/app/AppConfirmDeletion.vue";

const filters = ref({});

const showAddPokemonDialog = ref(false);

const updateFilters = (inputFilters) => {
    filters.value = inputFilters;
};

const openAddPokemonForm = () => {
    showAddPokemonDialog.value = true;
};

const closeAddPokemonForm = () => {
    showAddPokemonDialog.value = false;
};
</script>
