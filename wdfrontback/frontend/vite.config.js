import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/backend": {
        target: "http://localhost:8000",
        changeOrigin: false, // Don't change origin to preserve cookie domain compatibility
        rewrite: (path) => path.replace(/^\/backend/, ""),
      },
      "/uploads": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
