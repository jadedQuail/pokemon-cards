<template>
    <div v-if="maskActive" class="custom-mask"></div>

    <Dialog
        v-model:visible="visible"
        :modal="false"
        :draggable="false"
        class="min-w-[400px] !w-[30vw] absolute-dialog"
        :closable="false"
    >
        <template #header>
            <span class="font-semibold text-xl text-center w-full">{{ currentStep.header }}</span>
        </template>
        <span class="text-surface-500 dark:text-surface-400 block mb-8">
            {{ currentStep.content }}
        </span>
        <div class="flex justify-center gap-2">
            <Button type="button" label="Next" @click="nextStep"></Button>
        </div>
    </Dialog>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(true);
const maskActive = ref(true);

const steps = [
    {
        header: "Welcome to Josh's Pokemon Card Database!",
        content: `This is a database I created to keep track of all of my Pokemon cards.`,
        highlightElementId: ""
    },
    {
        header: "Add a Pokemon",
        content: "You can add a Pokemon card by clicking the 'Add Pokemon' button.",
        highlightElementId: "addPokemonButton"
    },
    {
        header: "Search for a Pokemon",
        content: "Use the search bar to search for a pokemon.",
        highlightElementId: "searchBar"
    },
    {
        header: "Page Title",
        content: "This is the page title. Super cool.",
        highlightElementId: "pageTitle"
    }
];

let currentStepIndex = ref(0);
const currentStep = ref(steps[currentStepIndex.value]);

const nextStep = async () => {
    removeHighlight();

    currentStepIndex.value++;
    if (currentStepIndex.value < steps.length) {
        currentStep.value = steps[currentStepIndex.value];
        await nextTick();
        applyHighlight();
    } else {
        visible.value = false;
        maskActive.value = false;
    }
};

const applyHighlight = () => {
    const element = document.getElementById(currentStep.value.highlightElementId);

    if (element) {
        element.classList.add("highlight-target");
    } else {
        setTimeout(() => {
            const retryElement = document.getElementById(currentStep.value.highlightElementId);
            if (retryElement) {
                retryElement.classList.add("highlight-target");
            }
        }, 100);
    }
};

const removeHighlight = () => {
    const element = document.getElementById(currentStep.value.highlightElementId);
    if (element) {
        element.classList.remove("highlight-target");
    }
};
</script>

<style>
.custom-mask {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1100; /* Lower than the highlighted element */
}

/* Element to be highlighted */
.highlight-target {
    position: relative !important; /* Ensure proper positioning for z-index to take effect */
    z-index: 1101 !important; /* Ensure it appears above the mask */
    border: 3px solid yellow; /* Optional: Highlight border */
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.7); /* Optional: Add a glowing effect */
    pointer-events: none;
}

.absolute-dialog {
    position: absolute;
}
</style>