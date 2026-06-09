import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": "/src",
    },
  },

  server: {
    port: process.env.PORT||5173,
    proxy: {
      "/api": {
        target: process.env.VITE_URL||"http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});