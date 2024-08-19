<template>
    <div class="px-[2%] mx-auto">
        <DataTable
            :filters="filters"
            @update:filters="updateFilters"
            @sort="viewSortOrder"
            :value="pokemonData"
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
        >
            <Column field="ID" header="ID" sortable></Column>
            <Column field="Name" header="Name" sortable></Column>
            <Column field="HP" header="HP" sortable></Column>
            <Column field="Type" header="Type" sortable></Column>
            <Column field="Set" header="Set" sortable></Column>
            <Column field="Flavor Text" header="Flavor Text" sortable></Column>
            <Column header="Options" bodyClass="!pl-3">
                <template #body>
                    <div class="flex justify-center space-x-5">
                        <InputIcon class="pi pi-pencil text-green-600 cursor-pointer" />
                        <InputIcon class="pi pi-trash text-red-600 cursor-pointer" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import 'primeicons/primeicons.css';

let axios;

// Cannot believe I have to do this because PrimeVue can't get its presets right
const idSortOrder = ref(0);

const config = useRuntimeConfig();

const props = defineProps({
    filters: {
        type: Object,
        default: () => ({})
    }
});

const pokemonData = ref([]);

const fetchData = async() => {
    try {
        axios = (await import('axios')).default;
        const response = await axios.get(config.public.API_URL);
        pokemonData.value = response.data;
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};

const calculateScrollHeight = () => {
    if (typeof window !== 'undefined') {
        return `${(window.innerHeight - 50) * 0.83}px`;
    }
    return '600px';
}

const scrollHeight = ref('600px');

const updateScrollHeight = () => {
    scrollHeight.value = calculateScrollHeight();
}

onMounted(async () => {
    fetchData();
    updateScrollHeight();
    window.addEventListener('resize', updateScrollHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScrollHeight);
})

const emit = defineEmits(['update:filters']);

const updateFilters = (newFilters) => {
    console.log("Hello!");
    emit('update:filters', newFilters);
}

const viewSortOrder = (event) => {
    console.log(event);
}
</script>
