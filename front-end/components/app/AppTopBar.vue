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
                    size="small"
                    label="Add Pokemon"
                    @click="store.showAddPokemonDialog(PokemonFormMode.Add)"
                    :pt="{
                        root: {
                            class: 'whitespace-nowrap mr-2 py-[9px] px-3 !text-custom-blue-800 bg-white hover:!bg-custom-blue-100 relative items-center inline-flex text-center align-bottom justify-center leading-[normal] text-sm py-1.5 px-3 gap-2 rounded-md text-primary-contrast bg-primary hover:bg-primary-emphasis transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none [&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
                        },
                    }"
                />
                <SplitButton
                    :pt="{
                        pcButton: {
                            root: 'bg-white hover:!bg-custom-blue-100 relative items-center inline-flex text-center align-bottom justify-center leading-[normal] px-3 py-2 rounded-md text-primary-contrast bg-primary transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none [&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
                        },
                        pcDropdown: {
                            root: 'bg-white hover:!bg-custom-blue-100 relative items-center inline-flex text-center align-bottom justify-center leading-[normal] px-3 py-2 w-10 px-0 gap-0 rounded-md text-primary-contrast bg-primary transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none [&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
                        },
                    }"
                    class="mr-2"
                >
                    <template #dropdownicon>
                        <i class="pi pi-angle-down text-custom-blue-800"></i>
                    </template>
                    <span class="flex items-center">
                        <span
                            class="!text-custom-blue-800 font-medium !text-[14px]"
                            >More</span
                        >
                    </span>
                </SplitButton>
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
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import { FilterMatchMode } from "@primevue/core/api";
import { useStore } from "~/store/store.js";
import { PokemonFormMode } from "~/static/constants.js";

const emit = defineEmits(["search-change"]);
const store = useStore();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const emitSearch = () => {
    emit("search-change", filters.value);
};
</script>
