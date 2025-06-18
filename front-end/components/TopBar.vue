<template>
    <div>
        <div class="h-14 bg-custom-blue-800 flex items-center justify-between">
            <!-- Left Content -->
            <div class="flex items-center">
                <h1
                    class="ml-4 mr-2 pb-1 text-white text-xl font-sans hidden lg:block"
                >
                    Pokemon Card Database
                </h1>
                <Button
                    data-testid="add-pokemon-button"
                    v-if="authStore.user.isAdmin"
                    size="small"
                    label="Add Pokemon"
                    @click="
                        pokemonStore.showAddPokemonDialog(PokemonFormMode.Add)
                    "
                    :pt="{
                        root: {
                            class: 'whitespace-nowrap ml-2 py-[9px] px-3 !text-custom-blue-800 bg-white hover:!bg-custom-blue-100 relative items-center inline-flex text-center align-bottom justify-center leading-[normal] text-sm py-1.5 px-3 gap-2 rounded-md text-primary-contrast bg-primary hover:bg-primary-emphasis transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none [&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
                        },
                    }"
                />
                <SplitButton
                    class="ml-2"
                    v-if="authStore.user.isAdmin"
                    :pt="{
                        pcButton: {
                            root: 'bg-white relative items-center inline-flex text-center align-bottom justify-center leading-[normal] px-3 py-2 rounded-md text-primary-contrast bg-primary transition duration-200 ease-in-out cursor-default overflow-hidden select-none [&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
                        },
                        pcDropdown: {
                            root: 'bg-white hover:!bg-custom-blue-100 relative items-center inline-flex text-center align-bottom justify-center leading-[normal] px-3 py-2 w-10 px-0 gap-0 rounded-md text-primary-contrast bg-primary transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none [&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
                        },
                    }"
                    :model="splitButtonOptions"
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
                <IconField class="ml-2">
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
                        {{ getGreetingText() }}
                    </h1>
                </div>
                <Button
                    size="small"
                    :icon="loginIcon"
                    @click="handleLoginLogoutClick()"
                    :pt="{
                        root: {
                            class: 'whitespace-nowrap ml-4 mr-2 py-[9px] px-3 !text-custom-blue-800 bg-white hover:!bg-custom-blue-100 relative items-center inline-flex text-center align-bottom justify-center leading-[normal] text-sm py-1.5 px-3 rounded-md text-primary-contrast bg-primary hover:bg-primary-emphasis transition duration-200 ease-in-out cursor-pointer overflow-hidden select-none [&>[data-pc-name=badge]]:min-w-4 [&>[data-pc-name=badge]]:h-4 [&>[data-pc-name=badge]]:leading-4',
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
import { PokemonFormMode, CategoriesFormMode } from "~/static/constants.js";

import { useAuthStore } from "~/stores/authStore.js";
import { usePokemonStore } from "~/stores/pokemonStore.js";
import { useCategoryStore } from "~/stores/categoryStore.js";

const emit = defineEmits(["search-change"]);

const authStore = useAuthStore();
const pokemonStore = usePokemonStore();
const categoryStore = useCategoryStore();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const emitSearch = () => {
    emit("search-change", filters.value);
};

const getGreetingText = () => {
    const username = authStore.user?.username;
    return username && username.trim() !== "" ? `Hello, ${username}` : "Login";
};

const splitButtonOptions = [
    {
        label: "Edit Types",
        command: () => {
            categoryStore.showCategoriesDialog(CategoriesFormMode.Types);
        },
    },
    {
        label: "Edit Sets",
        command: () => {
            categoryStore.showCategoriesDialog(CategoriesFormMode.Sets);
        },
    },
];

const loginIcon = computed(() => {
    return authStore.isLoggedIn ? "pi pi-sign-out" : "pi pi-sign-in";
});

function handleLoginLogoutClick() {
    if (authStore.isLoggedIn) {
        authStore.showLogoutDialog();
    } else {
        authStore.showLoginDialog();
    }
}
</script>
