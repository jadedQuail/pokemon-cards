<template>
    <div>
        <DataTable :value="pokemonData" tableStyle="min-width: 50rem">
            <Column field="ID" header="ID"></Column>
            <Column field="Name" header="Name"></Column>
            <Column field="HP" header="HP"></Column>
            <Column field="Type" header="Type"></Column>
            <Column field="Set" header="Set"></Column>
            <Column field="Flavor Text" header="Flavor Text"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
let axios;
const config = useRuntimeConfig();

const pokemonData = ref([]);

const fetchData = async() => {
    try {
        axios = (await import('axios')).default;
        const response = await axios.get(config.public.API_URL);
        pokemonData.value = response.data;
        console.log(pokemonData.value);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};

onMounted(async () => {
    fetchData();
});
</script>