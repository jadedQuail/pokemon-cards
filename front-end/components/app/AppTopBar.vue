<template>
    <div>
        <div class="h-14 bg-custom-blue-800 flex items-center justify-between">
            <!-- Left Content -->
            <div class="flex items-center">
                <h1
                    class="pl-3 pb-1 text-white text-xl font-sans hidden sm:block"
                >
                    Pokemon Card Database
                </h1>
            </div>
            <!-- Right Content -->
            <div class="flex items-center">
                <Button
                    class="mr-2 py-[9.5px] !text-custom-blue-800 bg-white hover:!bg-custom-blue-100"
                    size="small"
                    label="Add Pokemon"
                    @click="emitAddPokemon"
                />
                <IconField class="mr-2">
                    <InputIcon class="pi pi-search" />
                    <InputText
                        v-model="filters['global'].value"
                        placeholder="Search"
                        @update:modelValue="emitSearch(filters)"
                    />
                </IconField>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from "vue";
import { FilterMatchMode } from "@primevue/core/api";

const emit = defineEmits(["search-change", "add-pokemon"]);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const emitSearch = () => {
    emit("search-change", filters.value);
};

const emitAddPokemon = () => {
    emit("add-pokemon");
};
</script>
