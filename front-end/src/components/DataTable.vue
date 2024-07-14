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

<script>
import { defineComponent } from 'vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';

export default defineComponent({
    components: {
        TableHeader,
        TableRow,
    },
    setup() {
        const columns = ref([]);
        const data = ref([]);

        const fetchData = async() => {
            try {
                const response = await axios.get(process.env.VUE_APP_API_URL);
                data.value = response.data;
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        const fetchColumnHeaders = async() => {
            try {
                const response = await axios.get(process.env.VUE_APP_API_URL + '/column-headers');
                columns.value = response.data;
            } catch (error) {
                console.error('Error fetching column headers for data: ', error);
            }
        }

        onMounted(() => {
            fetchData();
            fetchColumnHeaders();
        })

        return {
            columns,
            data,
            fetchColumnHeaders,
            fetchData,
        }
    }
})
</script>

<style scoped>

</style>