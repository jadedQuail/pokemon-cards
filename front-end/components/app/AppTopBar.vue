<template>
    <div>
        <div class="h-14 bg-custom-blue-800 flex items-center justify-between">
            <!-- Left Content -->
            <div class="flex items-center">
                <div class="pl-2">
                    <PokeballIcon />
                </div>
                <h1 class="pl-3 pb-1 text-white text-3xl font-sans">Pokemon Card Database</h1>
            </div>
            <!-- Right Content -->
            <div>
                <Button class="mr-2 !text-custom-blue-800 bg-white hover:!bg-custom-blue-100" size="small" label="Add Pokemon" />
            </div>
        </div>
    </div>
</template>

<script setup>
import PokeballIcon from '@/components/PokeballIcon.vue';
</script>