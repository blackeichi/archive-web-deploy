// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      guestEmail: process.env.NUXT_PUBLIC_GUEST_EMAIL,
      guestPassword: process.env.NUXT_PUBLIC_GUEST_PASSWORD,
    },
  },
  supabase: {
    redirect: false,
  },
});
