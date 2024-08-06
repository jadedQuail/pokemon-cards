<template>
    <div class="flex justify-center">
        <div class="w-full lg:w-3/4">
            <table class="min-w-full border border-black">
                
                <TableHeader :columns="columns"/>
                <tbody>
                    <TableRow
                        v-for="(row, index) in data"
                        :key="index"
                        :row="row"
                        :columns="columns"
                    />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
let axios;
const config = useRuntimeConfig();

import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';

const columns = ref([]);
const data = ref([]);

const fetchData = async() => {
    try {
        axios = (await import('axios')).default;
        const response = await axios.get(config.public.API_URL);
        data.value = response.data;
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};

const fetchColumnHeaders = async() => {
    try {
        axios = (await import('axios')).default;
        const response = await axios.get(config.public.API_URL + '/column-headers');
        columns.value = response.data;
    } catch (error) {
        console.error('Error fetching column headers for data: ', error);
    }
};

onMounted(async () => {
    fetchData();
    fetchColumnHeaders();
});
</script>
