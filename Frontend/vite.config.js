import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  server: {
    port: 5173,

    proxy: {
      "/api": {
        target: "http://localhost:5000/api/v1",
        changeOrigin: true,
      },
    },
  },
});