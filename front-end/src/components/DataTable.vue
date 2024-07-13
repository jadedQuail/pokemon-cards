<template>
    <div>

        <!-- Get the header of the table going -->
        <table>
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
        const columns = ref(['pokemon_id', 'pokemon_name']);
        const data = ref([]);

        const fetchData = async() => {
            try {
                const response = await axios.get(process.env.VUE_APP_API_URL);
                data.value = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        onMounted(() => {
            fetchData();
        })

        return {
            columns,
            data,
            fetchData,
        }
    }
})
</script>