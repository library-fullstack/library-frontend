import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // tối ưu chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-core": ["react", "react-dom", "react-router-dom"],
          "mui-core": ["@mui/material", "@mui/icons-material"],
          "mui-emotion": ["@emotion/react", "@emotion/styled"],
          animations: ["framer-motion", "swiper"],
        },
      },
    },
    minify: "esbuild",
    sourcemap: false,
    target: "es2015",
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
});
