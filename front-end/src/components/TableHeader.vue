<template>
    <thead>
        <th v-for="column in columns" :key="column">{{ column }}</th>
    </thead>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        columns: Array
    }
})
</script>
