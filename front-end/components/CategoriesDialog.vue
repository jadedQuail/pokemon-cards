<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="isVisible"
            modal
            :closable="false"
            :draggable="false"
            class="min-w-[400px]"
        >
            <Listbox
                v-model="selectedCity"
                :options="cities"
                multiple
                optionLabel="name"
            />
        </Dialog>
    </div>
</template>

<script setup>
const isVisible = true;

import { ref } from "vue";

const selectedCity = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
</script>