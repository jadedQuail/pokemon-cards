<template>
    <thead>
        <th 
            v-for="column in columns" 
            :key="column"
            class="border border-black bg-gray-200 px-4 py-3"
        >
            {{ column }}
        </th>
    </thead>
</template>

<script setup>
const props = defineProps({
    columns: {
        type: Array,
        required: true
    }
});
</script>
