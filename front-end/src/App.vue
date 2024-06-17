<template>
    <div>
        <img alt="Pokeball logo" src="./assets/pokemon-svgrepo-com.png">
        <h1>Pokemon Cards</h1>
        <DataTable />
    </div>
</template>

<script>
import DataTable from './components/DataTable.vue'

export default {
    name: 'App',
    components: {
        DataTable,
    }
}
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    img {
        width: 200px;
        height: auto;  
    }
</style>
