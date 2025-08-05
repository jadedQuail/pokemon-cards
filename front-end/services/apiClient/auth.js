import axios from "axios";
import { useAuthStore } from "~/stores/authStore.js";

import { LOCAL_STORAGE_TOKEN_KEY } from "~/static/constants.js";
import { RegistrationErrorCodes } from "../../shared/errorCodes";

export async function createUser(username, password, confirmPassword) {
    try {
        await axios.post(
            "/auth/create-user",
            {
                username,
                password,
                confirmPassword,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return { success: true };
    } catch (error) {
        const errorCode =
            error.response?.data?.errorCode ||
            RegistrationErrorCodes.UNKNOWN_ERROR;
        return { success: false, errorCode };
    }
}

export async function logUserIn(username, password) {
    const authStore = useAuthStore();

    try {
        const response = await axios.post(
            "/auth/login",
            {
                username,
                password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const token = response.data.token;
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

        authStore.setUserFromToken(token);

        return {
            success: true,
            user: JSON.parse(atob(token.split(".")[1])),
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Login failed.",
        };
    }
}
