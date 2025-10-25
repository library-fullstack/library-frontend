import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: "0.0.0.0",
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1000,
      sourcemap: env.VITE_SOURCEMAP === "true",
      target: "es2017",
      minify: "esbuild",
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
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
