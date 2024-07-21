<template>
    <td class="border border-black px-4 py-3">{{ value }}</td>
</template>

<script setup>

const props = defineProps({
    value: {
        type: [String, Number, Boolean],
        required: true
    }
});
</script>