<template>
    <button :class="buttonClass" type="button">{{ text }}</button>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
    props: {
        text: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const buttonClass = computed(() => {
            const baseClass = 'text-white text-2xl px-3 py-2 rounded';
            const colorClasses = {
                blue: 'bg-blue-500 hover:bg-blue-700',
                green: 'bg-green-500 hover:bg-green-700',
                red: 'bg-red-500 hover:bg-red-700',
            };
            return `${baseClass} ${colorClasses[props.color] || ''}`; 
        });
        return {
            buttonClass
        };
    }
});
</script>

<style scoped>
</style>

