globalThis.useRuntimeConfig = () => ({
    public: { API_URL: "http://test-api.local" },
});

// TODO: Add to the README.md instructions on how to run both back-end and front-end tests

import { shallowMount, config } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AddPokemonDialog from "~/components/AddPokemonDialog.vue";
import { AddPokemonFieldIds, PokemonFormMode } from "~/static/constants.js";
import { SeverityLevels } from "~/static/constants.js";

config.global.config.warnHandler = () => {};

const showToastMock = vi.fn();
vi.mock("~/composables/useToastNotification", () => ({
    useToastNotifications: () => ({
        showToast: showToastMock,
    }),
}));

let hideAddPokemonDialogMock = vi.fn();
let fetchPokemonDataMock = vi.fn();
let addPokemonFieldsMock;
let pokemonFormModeMock;

vi.mock("~/stores/pokemonStore.js", () => ({
    usePokemonStore: () => ({
        addPokemonDialogVisible: true,
        hideAddPokemonDialog: hideAddPokemonDialogMock,
        fetchPokemonData: fetchPokemonDataMock,
        get addPokemonFields() {
            return addPokemonFieldsMock;
        },
        get pokemonFormMode() {
            return pokemonFormModeMock;
        },
    }),
}));

let refreshCategoriesMock = vi.fn();

vi.mock("~/stores/categoryStore.js", () => ({
    useCategoryStore: () => ({
        types: [],
        sets: [],
        refreshCategories: refreshCategoriesMock,
    }),
}));

const addPokemonMock = vi.fn();
vi.mock("~/services/apiClient/pokemon.js", () => ({
    get addPokemon() {
        return addPokemonMock;
    },
    get editPokemon() {
        return vi.fn();
    },
}));

const globalStubs = {
    Dialog: { template: "<div><slot/></div>" },
    Button: {
        props: ["label", "type", "severity"],
        template: '<button :type="type">{{ label }}</button>',
    },
    InputText: {
        props: ["modelValue"],
        template: '<input :value="modelValue" />',
    },
    Select: {
        props: ["modelValue"],
        template:
            '<select><option :selected="!!modelValue">{{ modelValue }}</option></select>',
    },
    Textarea: {
        props: ["modelValue"],
        template: "<textarea>{{ modelValue }}</textarea>",
    },
};

describe("AddPokemonDialog.vue", () => {
    beforeEach(() => {
        hideAddPokemonDialogMock = vi.fn();
        fetchPokemonDataMock = vi.fn();
        refreshCategoriesMock = vi.fn();
        addPokemonMock.mockClear();
        showToastMock.mockClear();

        pokemonFormModeMock = PokemonFormMode.Add;
        addPokemonFieldsMock = {
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
        };
    });

    it("calls hideAddPokemonDialog when the Cancel button is clicked", async () => {
        const wrapper = shallowMount(AddPokemonDialog, {
            global: {
                plugins: [createPinia()],
                stubs: globalStubs,
            },
        });

        const cancelButton = wrapper.find(
            '[data-testid="cancel-add-pokemon-button"]'
        );
        await cancelButton.trigger("click");

        expect(hideAddPokemonDialogMock).toHaveBeenCalledTimes(1);
    });

    it("does NOT call addPokemon when a required field is blank", async () => {
        const wrapper = shallowMount(AddPokemonDialog, {
            global: {
                plugins: [createPinia()],
                stubs: globalStubs,
            },
        });

        const form = wrapper.find('[data-testid="add-pokemon-form"]');
        await form.trigger("submit");

        expect(addPokemonMock).not.toHaveBeenCalled();
        expect(hideAddPokemonDialogMock).not.toHaveBeenCalled();
        expect(showToastMock).not.toHaveBeenCalled();
    });

    it("pre-fills form fields when the dialog is opened in Edit mode", async () => {
        pokemonFormModeMock = PokemonFormMode.Edit;
        addPokemonFieldsMock = {
            [AddPokemonFieldIds.Name]: {
                content: "Pikachu",
                valid: true,
                name: AddPokemonFieldIds.Name,
            },
            [AddPokemonFieldIds.HP]: {
                content: "60",
                valid: true,
                name: AddPokemonFieldIds.HP,
            },
            [AddPokemonFieldIds.Type]: {
                content: "Electric",
                valid: true,
                name: AddPokemonFieldIds.Type,
            },
            [AddPokemonFieldIds.Set]: {
                content: "Base Set",
                valid: true,
                name: AddPokemonFieldIds.Set,
            },
            [AddPokemonFieldIds.FlavorText]: {
                content:
                    "It keeps its tail raised to monitor its surroundings.",
                valid: true,
                name: AddPokemonFieldIds.FlavorText,
            },
        };

        const wrapper = shallowMount(AddPokemonDialog, {
            global: {
                plugins: [createPinia()],
                stubs: globalStubs,
            },
        });

        const inputs = wrapper.findAll("input");
        expect(inputs[0].element.value).toBe("Pikachu");
        expect(inputs[1].element.value).toBe("60");

        const selects = wrapper.findAll("select");
        expect(selects[0].text()).toContain("Electric");
        expect(selects[1].text()).toContain("Base Set");

        const textarea = wrapper.find("textarea");
        expect(textarea.text()).toContain(
            "It keeps its tail raised to monitor its surroundings."
        );
    });

    it("submits the form and calls addPokemon when all fields are valid", async () => {
        pokemonFormModeMock = PokemonFormMode.Add;
        addPokemonFieldsMock = {
            [AddPokemonFieldIds.Name]: {
                content: "Charmander",
                valid: true,
                name: AddPokemonFieldIds.Name,
            },
            [AddPokemonFieldIds.HP]: {
                content: "50",
                valid: true,
                name: AddPokemonFieldIds.HP,
            },
            [AddPokemonFieldIds.Type]: {
                content: "Fire",
                valid: true,
                name: AddPokemonFieldIds.Type,
            },
            [AddPokemonFieldIds.Set]: {
                content: "Jungle",
                valid: true,
                name: AddPokemonFieldIds.Set,
            },
            [AddPokemonFieldIds.FlavorText]: {
                content: "Obviously prefers hot places.",
                valid: true,
                name: AddPokemonFieldIds.FlavorText,
            },
        };

        const wrapper = shallowMount(AddPokemonDialog, {
            global: {
                plugins: [createPinia()],
                stubs: globalStubs,
            },
        });

        const form = wrapper.find('[data-testid="add-pokemon-form"]');
        await form.trigger("submit");

        expect(addPokemonMock).toHaveBeenCalledTimes(1);
        expect(addPokemonMock).toHaveBeenCalledWith(
            "http://test-api.local",
            addPokemonFieldsMock
        );

        expect(hideAddPokemonDialogMock).toHaveBeenCalledTimes(1);
        expect(showToastMock).toHaveBeenCalledWith(
            SeverityLevels.Info,
            "Card Created",
            expect.stringContaining("Charmander")
        );
    });
});
