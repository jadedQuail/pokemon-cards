globalThis.useRuntimeConfig = () => ({
    public: { API_URL: "http://test-api.local" },
});

import { shallowMount, config } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AddPokemonDialog from "~/components/AddPokemonDialog.vue";
import { AddPokemonFieldIds, PokemonFormMode } from "~/static/constants.js";

config.global.config.warnHandler = () => {};

const showToastMock = vi.fn();
vi.mock("~/composables/useToastNotification", () => ({
    useToastNotifications: () => ({
        showToast: showToastMock,
    }),
}));

let hideAddPokemonDialogMock = vi.fn();
let refreshCategoriesMock = vi.fn();
vi.mock("~/stores/pokemonStore.js", () => ({
    usePokemonStore: () => ({
        addPokemonDialogVisible: true,
        hideAddPokemonDialog: hideAddPokemonDialogMock,
        addPokemonFields: {
            [AddPokemonFieldIds.Name]: {
                content: "",
                valid: true,
                name: AddPokemonFieldIds.Name,
            },
            [AddPokemonFieldIds.HP]: {
                content: "",
                valid: true,
                name: AddPokemonFieldIds.HP,
            },
            [AddPokemonFieldIds.Type]: {
                content: "",
                valid: true,
                name: AddPokemonFieldIds.Type,
            },
            [AddPokemonFieldIds.Set]: {
                content: "",
                valid: true,
                name: AddPokemonFieldIds.Set,
            },
            [AddPokemonFieldIds.FlavorText]: {
                content: "",
                valid: true,
                name: AddPokemonFieldIds.FlavorText,
            },
        },
        pokemonFormMode: PokemonFormMode.Add,
    }),
}));

vi.mock("~/stores/categoryStore.js", () => ({
    useCategoryStore: () => ({
        types: [],
        sets: [],
        refreshCategories: refreshCategoriesMock,
    }),
}));

const globalStubs = {
    Dialog: { template: "<div><slot/></div>" },
    Button: {
        props: ["label", "type", "severity"],
        template: '<button :type="type">{{ label }}</button>',
    },
};

describe("AddPokemonDialog.vue", () => {
    beforeEach(() => {
        hideAddPokemonDialogMock = vi.fn();
        refreshCategoriesMock = vi.fn();
    });

    it("calls hideAddPokemonDialog when the Cancel button is clicked", async () => {
        const wrapper = shallowMount(AddPokemonDialog, {
            global: {
                plugins: [createPinia()],
                stubs: globalStubs,
            },
        });

        // Find the "Cancel" button (type="button")
        const cancelButton = wrapper.find(
            '[data-testid="cancel-add-pokemon-button"]'
        );
        await cancelButton.trigger("click");

        // Should call the store's hideAddPokemonDialog
        expect(hideAddPokemonDialogMock).toHaveBeenCalledTimes(1);
    });
});
