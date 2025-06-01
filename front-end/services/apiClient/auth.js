import axios from "axios";
import { useStore } from "~/store/store.js";

import { LOCAL_STORAGE_TOKEN_KEY } from "~/static/constants.js";
import { RegistrationErrorCodes } from "../../shared/errorCodes";

export async function createUser(apiUrl, username, password, confirmPassword) {
    try {
        await axios.post(
            `${apiUrl}/auth/create-user`,
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

export async function logUserIn(apiUrl, username, password) {
    const store = useStore();

    try {
        const response = await axios.post(
            `${apiUrl}/auth/login`,
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

        store.setUserFromToken(token);

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
