<template>
    <tr>
        <TableCell 
            v-for="(column, index) in columns"
            :key="index"
            :value="row[column]"
        />
    </tr>
</template>

<script setup>
import TableCell from './TableCell.vue';

const props = defineProps({
    row: Object,
    columns: Array, 
});
</script>
