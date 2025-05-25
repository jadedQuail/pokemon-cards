import { initializeAuth } from "~/services/authService.js";

export default defineNuxtPlugin(() => {
    initializeAuth();
});
