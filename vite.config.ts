import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/deep-code-ai/",
  },

  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        enabled: true,
        outputPath: "index.html",
        crawlLinks: true,
      },
    },

    server: {
      entry: "server",
    },
  },
});
