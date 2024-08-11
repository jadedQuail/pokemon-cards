<template>
    <div>
        <AppTopBar
            @search-change="updateFilters"
            class="fixed top-0 left-0 w-full z-[9999]"
        />
        <AppDataTable
            class="pt-16" 
            :filters="filters"
            @update:filters="updateFilters" 
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';

import AppDataTableVue from '../components/app/AppDataTable.vue';
import AppTopBar from '../components/app/AppTopBar.vue';

const filters = ref({});

const updateFilters = (inputFilters) => {
    filters.value = inputFilters;
}
</script>
