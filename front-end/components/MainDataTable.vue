<template>
    <div class="px-[2%] mx-auto">
        <DataTable
            :filters="filters"
            @update:filters="updateFilters"
            :value="pokemonStore.pokemonData"
            scrollable
            removableSort
            :scrollHeight="scrollHeight"
            stripedRows
            paginator
            paginatorPosition="top"
            :rows="20"
            :rowsPerPageOptions="[20, 50, 100]"
            tableStyle="min-width: 50rem"
            class="fixed-header"
            :loading="!pokemonStore.dataLoaded"
            loadingIcon="null"
        >
            <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column field="hp" header="HP" sortable></Column>
            <Column field="type" header="Type" sortable></Column>
            <Column field="set" header="Set" sortable></Column>
            <Column field="flavorText" header="Flavor Text" sortable></Column>
            <Column
                header="Options"
                bodyClass="!pl-3"
                v-if="authStore.user.isAdmin"
            >
                <template #body="slotProps">
                    <div class="flex justify-center space-x-5">
                        <InputIcon
                            data-testid="edit-icon"
                            class="pi pi-pencil text-green-600 cursor-pointer"
                            @click="editRow(slotProps.data)"
                        />
                        <InputIcon
                            class="pi pi-trash text-red-600 cursor-pointer"
                            @click="deleteRow(slotProps.data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
        <div
            v-if="!pokemonStore.dataLoaded"
            class="text-3xl flex items-center justify-center mt-4"
        >
            <i class="pi pi-spinner animate-spin text-3xl"></i>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { useAuthStore } from "~/stores/authStore.js";
import { usePokemonStore } from "~/stores/pokemonStore.js";

import "primeicons/primeicons.css";
import { PokemonFormMode } from "~/static/constants.js";

import { useConfirmDialog } from "@/composables/useConfirmDialog";
const { openConfirmDialog, currentPokemonData } = useConfirmDialog();

const authStore = useAuthStore();
const pokemonStore = usePokemonStore();

const config = useRuntimeConfig();

const props = defineProps({
    filters: {
        type: Object,
        default: () => ({}),
    },
});

const scrollHeight = ref("600px");

const calculateScrollHeight = () => {
    if (typeof window !== "undefined") {
        return `${(window.innerHeight - 50) * 0.83}px`;
    }
    return "600px";
};

const updateScrollHeight = () => {
    scrollHeight.value = calculateScrollHeight();
};

onMounted(async () => {
    await pokemonStore.fetchPokemonData(config.public.API_URL);
    updateScrollHeight();
    window.addEventListener("resize", updateScrollHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateScrollHeight);
});

const emit = defineEmits(["update:filters"]);

const updateFilters = (newFilters) => {
    emit("update:filters", newFilters);
};

const deleteRow = (rowData) => {
    const plainRowData = { ...rowData };
    openConfirmDialog(
        "Confirmation",
        "Please confirm you wish to delete the following item:",
        plainRowData
    );
};

const editRow = (rowData) => {
    pokemonStore.editingPokemonId = rowData.id;

    pokemonStore.setFieldContentForEditDialog({
        id: rowData.id,
        name: rowData.name,
        hp: String(rowData.hp),
        type: rowData.type,
        set: rowData.set,
        flavorText: rowData.flavorText,
    });

    pokemonStore.showAddPokemonDialog(PokemonFormMode.Edit);
};
</script>
