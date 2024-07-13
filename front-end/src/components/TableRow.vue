<template>
    <tr>
        <TableCell 
            v-for="(column, index) in columns"
            :key="index"
            :value="row[column]"
        />
    </tr>
</template>

<script>
import { defineComponent } from 'vue';

import TableCell from './TableCell.vue';

export default defineComponent({
    components: {
        TableCell,
    },
    props: {
        row: Object,       //{ PokemonId: '1', PokemonName: 'Bulbasaur'}
        columns: Array,    //['PokemonID', 'PokemonName']
    }
})
</script>
