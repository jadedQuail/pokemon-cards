<template>
    <AppTopBar
        @search-change="grabFilters"
    />
    <AppDataTable :filters="filters" />
</template>

<script setup>
import { ref } from 'vue';

import AppDataTableVue from '../components/app/AppDataTable.vue';
import AppTopBar from '../components/app/AppTopBar.vue';

const showForm = ref(false);

const toggleForm = () => {
    showForm.value = !showForm.value;
}

const filters = ref({});

const grabFilters = (inputFilters) => {
    filters.value = inputFilters;
}
</script>
