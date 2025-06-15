import { shallowMount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, it, expect, vi, beforeEach } from "vitest";

import TopBar from "~/components/TopBar.vue";
import { FilterMatchMode } from "@primevue/core/api";

import { PokemonFormMode, CategoriesFormMode } from "~/static/constants.js";

let isLoggedIn = false;

const showLoginDialogMock = vi.fn();
const showLogoutDialogMock = vi.fn();
vi.mock("~/stores/authStore.js", () => ({
    useAuthStore: () => ({
        user: { isAdmin: true },
        isLoggedIn,
        showLoginDialog: showLoginDialogMock,
        showLogoutDialog: showLogoutDialogMock,
    }),
}));

const showAddPokemonDialogMock = vi.fn();
vi.mock("~/stores/pokemonStore.js", () => ({
    usePokemonStore: () => ({
        showAddPokemonDialog: showAddPokemonDialogMock,
    }),
}));

const showCategoriesDialogMock = vi.fn();
vi.mock("~/stores/categoryStore.js", () => ({
    useCategoryStore: () => ({
        showCategoriesDialog: showCategoriesDialogMock,
    }),
}));

describe("TopBar.vue", () => {
    beforeEach(() => {
        showAddPokemonDialogMock.mockClear();
        showCategoriesDialogMock.mockClear();
        showLoginDialogMock.mockClear();
        showLogoutDialogMock.mockClear();
        isLoggedIn = false;
    });

    it("opens the Add Pokemon dialog when Add Pokemon button is clicked", async () => {
        const wrapper = shallowMount(TopBar, {
            global: {
                plugins: [createPinia()],
            },
        });

        const addButton = wrapper.find('[data-testid="add-pokemon-button"]');
        await addButton.trigger("click");

        expect(showAddPokemonDialogMock).toHaveBeenCalledTimes(1);
        expect(showAddPokemonDialogMock).toHaveBeenCalledWith(
            PokemonFormMode.Add
        );
    });

    it("opens the Categories dialog when either the Edit Types or Edit Sets button is clicked", async () => {
        const wrapper = shallowMount(TopBar, {
            global: {
                plugins: [createPinia()],
                stubs: {
                    SplitButton: {
                        props: ["model"],
                        template: `
                            <div>
                                <span
                                    v-for="item in model"
                                    :key="item.label"
                                    data-pc-section="itemlabel"
                                    @click="item.command"
                                >
                                    {{ item.label }}
                                </span>
                            </div>
                        `,
                    },
                },
            },
        });

        const items = wrapper.findAll('[data-pc-section="itemlabel"]');

        const editTypes = items.find((i) => i.text() === "Edit Types");
        await editTypes.trigger("click");
        expect(showCategoriesDialogMock).toHaveBeenCalledTimes(1);
        expect(showCategoriesDialogMock).toHaveBeenCalledWith(
            CategoriesFormMode.Types
        );

        const editSets = items.find((i) => i.text() === "Edit Sets");
        await editSets.trigger("click");
        expect(showCategoriesDialogMock).toHaveBeenCalledTimes(2);
        expect(showCategoriesDialogMock).toHaveBeenCalledWith(
            CategoriesFormMode.Sets
        );
    });

    it("Emits a search-change when new text is entered into the search box", async () => {
        const wrapper = shallowMount(TopBar, {
            global: {
                plugins: [createPinia()],
                stubs: {
                    InputText: {
                        props: ["modelValue", "placeholder"],
                        emits: ["update:modelValue"],
                        template: `
                            <input
                                :value="modelValue"
                                :placeholder="placeholder"
                                @input="$emit('update:modelValue', $event.target.value)"
                            />
                        `,
                    },
                },
            },
        });

        const input = wrapper.find('[data-testid="search-input"]');
        expect(input.exists()).toBe(true);

        await input.setValue("pikachu");
        const emitted = wrapper.emitted("search-change");
        expect(emitted).toHaveLength(1);

        expect(emitted[0]).toEqual([
            {
                global: {
                    value: "pikachu",
                    matchMode: FilterMatchMode.CONTAINS,
                },
            },
        ]);
    });

    it("Opens login dialog when the login button is clicked (and user is not logged in)", async () => {
        isLoggedIn = false;

        const wrapper = shallowMount(TopBar, {
            global: {
                plugins: [createPinia()],
            },
        });

        const loginButton = wrapper.find('[data-testid="login-logout-button"]');
        await loginButton.trigger("click");

        expect(showLoginDialogMock).toHaveBeenCalledTimes(1);
        expect(showLogoutDialogMock).not.toHaveBeenCalled();
    });

    it("Opens logout dialog when the logout button is clicked (and the user is logged in)", async () => {
        isLoggedIn = true;

        const wrapper = shallowMount(TopBar, {
            global: {
                plugins: [createPinia()],
            },
        });

        const logoutButton = wrapper.find(
            '[data-testid="login-logout-button"]'
        );
        await logoutButton.trigger("click");

        expect(showLogoutDialogMock).toHaveBeenCalledTimes(1);
        expect(showLoginDialogMock).not.toHaveBeenCalled();
    });
});
