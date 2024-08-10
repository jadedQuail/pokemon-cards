<template>
    <div class="w-11/12 mx-auto">
        <DataTable
            v-model:filters="filters" 
            :value="pokemonData" 
            stripedRows
            paginator
            paginatorPosition="both"
            :rows="20"
            :rowsPerPageOptions="[20, 50, 100]" 
            tableStyle="min-width: 50rem"
        >
            <Column field="ID" header="ID" sortable></Column>
            <Column field="Name" header="Name" sortable></Column>
            <Column field="HP" header="HP" sortable></Column>
            <Column field="Type" header="Type" sortable></Column>
            <Column field="Set" header="Set" sortable></Column>
            <Column field="Flavor Text" header="Flavor Text" sortable></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import 'primeicons/primeicons.css';

let axios;

const config = useRuntimeConfig();

const props = defineProps(['filters']);
const filters = ref({});
filters.value = props.filters;

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

onMounted(async () => {
    fetchData();
});
</script>