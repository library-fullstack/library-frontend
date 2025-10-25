import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
    ],
    server: {
      port: 5173,
      host: "0.0.0.0",
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1000,
      sourcemap: env.VITE_SOURCEMAP === "true",
      target: "es2020",
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              // Keep @emotion and @mui/material together to avoid initialization issues
              if (id.includes("@emotion") || id.includes("@mui/material")) {
                return "mui-core";
              }
              if (id.includes("@mui/icons-material")) {
                return "mui-icons";
              }
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
                return "react-vendor";
              }
              if (id.includes("framer-motion")) {
                return "framer-motion";
              }
              if (id.includes("swiper")) {
                return "swiper";
              }
              return "vendor";
            }
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
        "@mui/icons-material",
        "@emotion/react",
        "@emotion/styled",
        "framer-motion",
      ],
      esbuildOptions: {
        target: "es2020",
      },
    },
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
