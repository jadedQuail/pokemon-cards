<template>
    <tr>
        <td v-for="value in row">
            {{ value }}
        </td>
    </tr>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        row: Object,
        columns: Array,
    }
})
</script>
