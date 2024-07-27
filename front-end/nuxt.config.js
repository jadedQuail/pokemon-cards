import { defineNuxtConfig } from 'nuxt/config'
import dotenv from 'dotenv'

dotenv.config();

export default defineNuxtConfig({
  // Global page headers
  app: {
    head: {
      title: 'pokemon-cards',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL
    }
  },

  // Plugins
  plugins: [
    // Add plugins here
  ],

  // Auto import components
  components: true,

  // Modules for dev and build (recommended)
  buildModules: [

  ],

  // Modules
  modules: [

  ],

  // Build Configuration
  build: {
    // Add build configuration here
  },

  compatibilityDate: '2024-07-27'
})