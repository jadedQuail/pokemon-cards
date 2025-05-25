import { useStore } from "~/store/store.js";

export function initializeAuth() {
    const store = useStore();
    // TODO: Rename this to "pokemondb_token"
    const token = localStorage.getItem("jwt_token");

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const isExpired = payload.exp && Date.now() >= payload.exp * 1000;

            if (!isExpired) {
                store.setUserFromToken(token);
            } else {
                localStorage.removeItem("jwt_token");
            }
        } catch {
            localStorage.removeItem("jwt_token");
        }
    }

    store.finishAuthInit();
}
