<template>
    <form>
        <!-- Pokemon Name -->
        <label for="name">Name:</label><br>
        <input class="add-pokemon-input" type="text" id="name" name="name"><br>

        <!-- HP -->
        <label for="hp">HP:</label><br>
        <input class="add-pokemon-input" type="number" id="hp" name="hp" value=0><br>

        <!-- Type -->
        <label for="type">Type:</label><br>
        <select class="add-pokemon-input" name="type" id="type">
            <option value="darkness">Darkness</option>
            <option value="metal">Metal</option>
            <option value="lightning">Lightning</option>
        </select><br>

        <!-- Set -->
        <label for="set">Set:</label><br>
        <select class="add-pokemon-input" name="set" id="set">
            <option value="temporal-forces">Temporal Forces</option>
            <option value="paldea-evolved">Paldea Evolved</option>
        </select><br>

        <!-- Flavor Text -->
        <p>
            <label for="flavor-text">Flavor Text:</label><br>
        </p>
        <textarea class="add-pokemon-input" id="flavor-text" name="flavor-text" rows="3" cols="50"></textarea><br>

    </form>
</template>

<script setup>
</script>

<style scoped>
    .add-pokemon-input {
        @apply border border-black rounded-sm px-2 py-1;
    }
</style>