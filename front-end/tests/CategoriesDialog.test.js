import { beforeEach, expect, test, vi } from "vitest";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { screen, fireEvent, render } from "@testing-library/vue";
import { ref } from "vue";
import "@testing-library/jest-dom";

import { CategoriesFormMode } from "~/static/constants.js";

let CategoriesDialog;

const addTypeMock = vi.fn(() => ({ success: true }));
const deleteTypeMock = vi.fn();
const types = ["Fire", "Water"];
const refreshCategoriesMock = vi.fn();
const hideCategoriesDialogMock = vi.fn();

beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    window.confirm = vi.fn(() => true);

    vi.doMock("~/stores/categoryStore.js", () => ({
        useCategoryStore: () => ({
            categoriesDialogVisible: ref(true),
            categoriesFormMode: CategoriesFormMode.Types,
            types: types,
            refreshCategories: refreshCategoriesMock,
            hideCategoriesDialog: hideCategoriesDialogMock,
        }),
    }));

    vi.doMock("~/stores/pokemonStore.js", () => ({
        usePokemonStore: () => ({
            fetchPokemonData: vi.fn(),
        }),
    }));

    vi.doMock("@/services/apiClient/type.js", () => ({
        addType: addTypeMock,
        deleteType: deleteTypeMock,
    }));

    const module = await import("~/components/CategoriesDialog.vue");
    CategoriesDialog = module.default;
});

test("adds a new type and updates the store", async () => {
    await renderSuspended(CategoriesDialog);

    await fireEvent.update(screen.getByTestId("new-category-input"), "Dragon");
    await fireEvent.submit(screen.getByTestId("categories-form"));

    expect(addTypeMock).toHaveBeenCalledWith("Dragon");
    expect(refreshCategoriesMock).toHaveBeenCalled();
});

test("deletes a type and updates the store", async () => {
    await renderSuspended(CategoriesDialog);

    const fireCheckbox = screen.getByLabelText("Fire");
    await fireEvent.click(fireCheckbox);

    const deleteButton = screen.getByTestId("remove-category-button");
    await fireEvent.click(deleteButton);

    expect(deleteTypeMock).toHaveBeenCalled();
    expect(refreshCategoriesMock).toHaveBeenCalled();
});

test("the list of types in the dialog reflects those in the store", async () => {
    await renderSuspended(CategoriesDialog);

    for (const t of types) {
        expect(screen.getByLabelText(t)).toBeInTheDocument();
    }

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(types.length);
});
