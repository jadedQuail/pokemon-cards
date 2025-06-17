globalThis.useRuntimeConfig = () => ({
    public: { API_URL: "http://test-api.local" },
});

import { shallowMount, config } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia } from "pinia";
import { ref } from "vue";
import CategoriesDialog from "~/components/CategoriesDialog.vue";
import { CategoriesFormMode } from "~/static/constants.js";

config.global.config.warnHandler = () => {};

let deleteTypeMock,
    addTypeMock,
    refreshCategoriesMock,
    fetchPokemonDataMock,
    hideCategoriesDialogMock;
let typesMock, setsMock;

vi.mock("~/stores/categoryStore.js", () => ({
    useCategoryStore: () => ({
        categoriesDialogVisible: true,
        categoriesFormMode: CategoriesFormMode.Types,
        types: typesMock,
        sets: setsMock,
        refreshCategories: refreshCategoriesMock,
        hideCategoriesDialog: hideCategoriesDialogMock,
    }),
}));

vi.mock("~/stores/pokemonStore.js", () => ({
    usePokemonStore: () => ({
        fetchPokemonData: fetchPokemonDataMock,
    }),
}));

vi.mock("~/services/apiClient/type.js", () => ({
    addType: (...args) => addTypeMock(...args),
    deleteType: (...args) => deleteTypeMock(...args),
}));

vi.mock("~/services/apiClient/set.js", () => ({
    addSet: vi.fn(),
    deleteSet: vi.fn(),
}));

const globalStubs = {
    InputText: {
        props: ["modelValue"],
        emits: ["update:modelValue"],
        template: `
            <input
                data-testid="new-category-input"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        `,
    },
};

describe("CategoriesDialog.vue", () => {
    beforeEach(() => {
        typesMock = ref(["Fire", "Water"]);
        setsMock = ref([]);
        addTypeMock = vi.fn(() => Promise.resolve({ success: true }));
        deleteTypeMock = vi.fn(() => Promise.resolve({ success: true }));
        refreshCategoriesMock = vi.fn();
        fetchPokemonDataMock = vi.fn();
        hideCategoriesDialogMock = vi.fn();
    });

    it("adds a new type and it appears in the rendered list", async () => {
        const wrapper = shallowMount(CategoriesDialog, {
            global: {
                plugins: [createPinia()],
                stubs: globalStubs,
            },
        });

        const input = wrapper.find('[data-testid="new-category-input"]');
        await input.setValue("Dragon");

        vi.spyOn(window, "confirm").mockReturnValue(true);

        const form = wrapper.find('[data-testid="categories-form"]');
        await form.trigger("submit.prevent");

        expect(addTypeMock).toHaveBeenCalledWith(
            "http://test-api.local",
            "Dragon"
        );

        expect(refreshCategoriesMock).toHaveBeenCalled();
        expect(fetchPokemonDataMock).toHaveBeenCalled();
    });
});
