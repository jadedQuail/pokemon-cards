import { defineStore } from "pinia";
import {
    LOCAL_STORAGE_TOKEN_KEY,
    LoginFieldIds,
    RegisterFieldIds,
} from "~/static/constants";

function getNullUser() {
    return {
        id: null,
        username: "",
        isAdmin: false,
    };
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: getNullUser(),
        isAuthInitialized: false,
        loginDialogVisible: false,
        logoutDialogVisible: false,
        registerDialogVisible: false,
        loginFields: {
            [LoginFieldIds.Username]: {
                name: LoginFieldIds.Username,
                content: "",
                valid: true,
            },
            [LoginFieldIds.Password]: {
                name: LoginFieldIds.Password,
                content: "",
                valid: true,
            },
        },
        registerFields: {
            [RegisterFieldIds.Username]: {
                name: RegisterFieldIds.Username,
                content: "",
                valid: true,
            },
            [RegisterFieldIds.Password]: {
                name: RegisterFieldIds.Password,
                content: "",
                valid: true,
            },
            [RegisterFieldIds.ConfirmPassword]: {
                name: RegisterFieldIds.ConfirmPassword,
                content: "",
                valid: true,
            },
        },
    }),
    getters: {
        isLoggedIn: (state) => {
            return (
                state.user &&
                typeof state.user.id === "number" &&
                state.user.id !== null
            );
        },
    },
    actions: {
        setUserFromToken(token) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                this.user = decoded;
            } catch (err) {
                console.error("Invalid JWT:", err);
            }
        },
        clearUser() {
            this.user = getNullUser();
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        },
        finishAuthInit() {
            this.isAuthInitialized = true;
        },
        showLoginDialog() {
            this.loginDialogVisible = true;
        },
        hideLoginDialog() {
            this.loginDialogVisible = false;
        },
        showLogoutDialog() {
            this.logoutDialogVisible = true;
        },
        hideLogoutDialog() {
            this.logoutDialogVisible = false;
        },
        showRegisterDialog() {
            this.registerDialogVisible = true;
        },
        hideRegisterDialog() {
            this.registerDialogVisible = false;
        },
    },
});
