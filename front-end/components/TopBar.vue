<template>
    <div>
        <div class="h-14 bg-custom-blue-800 flex items-center justify-between">
            <!-- Left Content -->
            <div class="flex items-center">
                <h1
                    class="ml-4 pb-1 text-white text-xl font-sans hidden lg:block"
                >
                    Pokemon Card Database
                </h1>
                <Button
                    size="small"
                    label="Add Pokemon"
                    @click="store.showAddPokemonDialog(PokemonFormMode.Add)"
                    :pt="{
                        root: {
                            class: buttonRootClass,
                        },
                    }"
                />
                <SplitButton
                    :pt="{
                        pcButton: {
                            root: splitButtonMainClass,
                        },
                        pcDropdown: {
                            root: splitButtonDropdownClass,
                        },
                    }"
                    class="mr-2"
                    :model="splitButtonOptions"
                >
                    <template #dropdownicon>
                        <i class="pi pi-angle-down text-custom-blue-800"></i>
                    </template>
                    <span class="flex items-center">
                        <!-- TODO: Make it so this More button doesn't have a hover effect or mouse change on hover -->
                        <span
                            class="!text-custom-blue-800 font-medium !text-[14px]"
                            >More</span
                        >
                    </span>
                </SplitButton>
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText
                        v-model="filters['global'].value"
                        placeholder="Search"
                        @update:modelValue="emitSearch(filters)"
                    />
                </IconField>
            </div>
            <!-- Right Content -->
            <div class="flex items-center">
                <div class="pb-1 hidden custom-800px:block">
                    <h1 class="text-white text-xl font-sans text-right">
                        Login
                    </h1>
                </div>
                <!-- TODO: Make this tooltip colored like the rest of your color scheme -->
                <Button
                    size="small"
                    icon="pi pi-sign-in"
                    @click="store.showLoginDialog()"
                    :pt="{
                        root: {
                            class: loginButtonClass,
                        },
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import { FilterMatchMode } from "@primevue/core/api";
import { useStore } from "~/store/store.js";
import { PokemonFormMode, CategoriesFormMode } from "~/static/constants.js";
import {
    buttonRootClass,
    splitButtonMainClass,
    splitButtonDropdownClass,
    loginButtonClass,
} from "~/static/longTailwindClassNames.js";

const emit = defineEmits(["search-change"]);
const store = useStore();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const emitSearch = () => {
    emit("search-change", filters.value);
};

const splitButtonOptions = [
    {
        label: "Edit Types",
        command: () => {
            store.showCategoriesDialog(CategoriesFormMode.Types);
        },
    },
    {
        label: "Edit Sets",
        command: () => {
            store.showCategoriesDialog(CategoriesFormMode.Sets);
        },
    },
];
</script>
