import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api được chuyển sang backend (cổng 4000) khi chạy npm run dev
export default defineConfig({
  base: "./", // để chạy được trên GitHub Pages (đường dẫn con)
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: { "/api": { target: process.env.API_URL || "http://localhost:4000", changeOrigin: true } },
  },
});
