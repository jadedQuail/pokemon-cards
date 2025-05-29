import { LOCAL_STORAGE_TOKEN_KEY } from "~/static/constants.js";

export function getAuthHeaders() {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    const authHeader = {};

    if (token) {
        authHeader.Authorization = `Bearer ${token}`;
    }

    return {
        "Content-Type": "application/json",
        ...authHeader,
    };
}
