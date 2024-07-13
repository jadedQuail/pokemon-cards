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
import { ref } from 'vue';
import axios from 'axios';
import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';

export default {
    components: {
        TableHeader,
        TableRow,
    },
    setup() {
        const columns = ref(['PokemonID', 'PokemonName'])
        const data = ref([
            { PokemonId: '1', PokemonName: 'Bulbasaur'},
            { PokemonId: '2', PokemonName: 'Ivysaur'},
            { PokemonId: '3', PokemonName: 'Garfielf'},
        ])
        return {
            columns,
            data,
        }
    }
}
</script>