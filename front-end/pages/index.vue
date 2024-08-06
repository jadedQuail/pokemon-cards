<template>
    <AppTopBar />
    <AppDataTable />
</template>

<script setup>
import { ref } from 'vue';

import AppDataTableVue from '../components/app/AppDataTable.vue';
import AppTopBar from '../components/app/AppTopBar.vue';

const showForm = ref(false);

const toggleForm = () => {
    showForm.value = !showForm.value;
}
</script>
