import { useStore } from "~/store/store.js";
import { LOCAL_STORAGE_TOKEN_KEY } from "~/static/constants.js";

export function initializeAuth() {
    const store = useStore();

    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const isExpired = payload.exp && Date.now() >= payload.exp * 1000;

            if (!isExpired) {
                store.setUserFromToken(token);
            } else {
                localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
            }
        } catch {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        }
    }

    store.finishAuthInit();
}
