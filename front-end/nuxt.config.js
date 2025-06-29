import { defineNuxtConfig } from "nuxt/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default defineNuxtConfig({
    app: {
        head: {
            title: "pokemon-cards",
            htmlAttrs: {
                lang: "en",
            },
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                { hid: "description", name: "description", content: "" },
                { name: "format-detection", content: "telephone=no" },
            ],
            link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
        },
    },
    devtools: { enabled: true },
    css: ["~/assets/css/global.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            API_URL: process.env.API_URL,
        },
        turnstile: {
            secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
        },
    },
    plugins: ["~/plugins/auth.client.js"],
    components: true,
    buildModules: [],
    modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@nuxtjs/turnstile"],
    turnstile: {
        siteKey: "0x4AAAAAABiwR9ZxUeZqq9H0",
    },
    primevue: {
        options: {
            unstyled: true,
        },
        importPT: { as: "Aura", from: "~/presets/aura" }, //import and apply preset
    },
    compatibilityDate: "2024-07-27",
});
