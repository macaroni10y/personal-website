// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://macaroni10y.vercel.app",
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  redirects: {
    "/": "/ja",
  },
});
