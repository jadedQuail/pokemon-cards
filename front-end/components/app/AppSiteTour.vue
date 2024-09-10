<template>
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
        const rect = element.getBoundingClientRect();

        const overlayDiv = document.createElement("div");
        overlayDiv.classList.add("overlay-box");

        overlayDiv.style.position = "fixed";
        overlayDiv.style.top = "0";
        overlayDiv.style.left = "0";
        overlayDiv.style.width = "100vw";
        overlayDiv.style.height = "100vh";
        overlayDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        overlayDiv.style.zIndex = "1100";
        overlayDiv.style.pointerEvents = "auto";
        overlayDiv.style.clipPath = `polygon(
            0 0,
            0 100%,
            ${rect.left}px 100%,
            ${rect.left}px ${rect.top}px,
            ${rect.right}px ${rect.top}px,
            ${rect.right}px ${rect.bottom}px,
            ${rect.left}px ${rect.bottom}px,
            ${rect.left}px 100%,
            100% 100%,
            100% 0
        )`;

        document.body.appendChild(overlayDiv);

        const highlightDiv = document.createElement("div");
        highlightDiv.classList.add("highlight-box");

        highlightDiv.style.position = "absolute";
        highlightDiv.style.top = `${rect.top + window.scrollY}px`;
        highlightDiv.style.left = `${rect.left + window.scrollX}px`;
        highlightDiv.style.width = `${rect.width}px`;
        highlightDiv.style.height = `${rect.height}px`;
        highlightDiv.style.border = "3px solid yellow";
        highlightDiv.style.zIndex = "1101";
        highlightDiv.style.pointerEvents = "none";

        element.style.pointerEvents = "none";

        document.body.appendChild(highlightDiv);

        element.highlightOverlay = overlayDiv;
        element.highlightDiv = highlightDiv;
    } else {
        setTimeout(() => {
            const retryElement = document.getElementById(currentStep.value.highlightElementId);
            if (retryElement) {
                applyHighlight();
            }
        }, 100);
    }
};

const removeHighlight = () => {
    const element = document.getElementById(currentStep.value.highlightElementId);
    if (element && element.highlightDiv && element.highlightOverlay) {
        element.highlightDiv.remove();
        element.highlightOverlay.remove();
        element.style.pointerEvents = "";
        delete element.highlightDiv;
        delete element.highlightOverlay;
    }
};
</script>

<style>
.highlight-box {
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.7);
}
</style>