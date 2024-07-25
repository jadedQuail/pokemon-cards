<template>
    <button :class="buttonClass" type="button" @click="$emit('click')">{{ text }}</button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

const buttonClass = computed(() => {
    const baseClass = 'text-white text-2xl px-3 py-2 rounded';
    const colorClasses = {
        blue: 'bg-blue-500 hover:bg-blue-700',
        green: 'bg-green-500 hover:bg-green-700',
        red: 'bg-red-500 hover:bg-red-700',
    };
    return `${baseClass} ${colorClasses[props.color] || ''}`; 
});
</script>

<style scoped>
</style>

