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

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        columns: Array
    }
})
</script>
