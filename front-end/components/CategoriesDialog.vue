<template>
    <div class="flex justify-center">
        <Dialog
            v-model:visible="store.categoriesDialogVisible"
            modal
            :header="dialogHeader"
            :draggable="false"
            @hide="closeDialog"
            class="min-w-[450px] !max-h-[500px]"
            :pt="{
                header: {
                    class: [
                        'flex items-center justify-between shrink-0',
                        'px-6 pt-6 pb-2',
                        'rounded-tl-lg rounded-tr-lg',
                        'text-surface-700 dark:text-surface-0/80',
                        'border border-b-0 border-surface-200 dark:border-surface-700'
                    ].join(' ')
                },
                pcCloseButton: {
                    style: 'box-shadow: none;',
                },
            }"
        >
            <template #header>
                <div class="font-semibold text-xl leading-none">
                    Types
                </div>
            </template>
            <div class="mt-1 mb-5 space-x-2">
                <InputText type="text" v-model="value" />
                <Button
                    type="button"
                    label="Add Type"
                ></Button>
            </div>
            <!-- Types -->
            <div
                v-if="store.categoriesFormMode === CategoriesFormMode.Types"
                class="space-y-1"
            >
                <div
                    v-for="type in types"
                    :key="type"
                    class="flex items-center gap-2"
                >
                    <Checkbox
                        v-model="selectedTypes"
                        :inputId="type"
                        name="type"
                        :value="type"
                    />
                    <label :for="type">{{ type }}</label>
                </div>
            </div>
            <!-- Sets -->
            <div 
                v-else-if="store.categoriesFormMode === CategoriesFormMode.Sets"
                v-for="set in sets"
                :key="set"
            >
                <Checkbox
                    v-model="selectedSets"
                    :inputId="set"
                    name="set"
                    :value="set"
                />
                <label :for="set">{{ set }}</label>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "~/store/store.js";
import { CategoriesFormMode } from "~/static/constants.js";
import {
    getTypeOptions,
    getSetOptions,
} from "@/services/apiCalls";

const config = useRuntimeConfig();

const store = useStore();

// TODO: Make these types and sets store objects so they can be used both here and on AddPokemonDialog
const types = ref([]);
const selectedTypes = ref([]);

const sets = ref([]);
const selectedSets = ref([]);

const loadTypeOptions = async () => {
    try {
        const apiUrl = config.public.API_URL;
        types.value = await getTypeOptions(apiUrl);
    } catch (error) {
        console.error(
            'Error fetching type options for "Categories Dialog":',
            error
        );
    }
};

const loadSetOptions = async () => {
    try {
        const apiUrl = config.public.API_URL;
        sets.value = await getSetOptions(apiUrl);
    } catch (error) {
        console.error(
            'Error fetching set options for "Categories Dialog":',
            error
        );
    }
};

const closeDialog = () => {
    store.hideCategoriesDialog();
};

const dialogHeader = computed(() => {
    if (store.categoriesFormMode === CategoriesFormMode.Types) {
        return "Types";
    }
    return "Sets";
});

onMounted(async () => {
    await loadTypeOptions();
    await loadSetOptions();
});
</script>