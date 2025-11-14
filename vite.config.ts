import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import { injectPreloadTags } from "./vite-plugins/inject-preload";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
      imagetools(),
      ...(isProduction ? [injectPreloadTags()] : []),
    ],

    resolve: {
      alias: { "@": "/src" },
    },

    server: {
      port: 5173,
      host: "0.0.0.0",
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 5173,
      },
      cors: true,
    },

    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 2000,
      sourcemap: false,
      target: "es2020",
      minify: "esbuild",
      cssCodeSplit: true,
      reportCompressedSize: false,

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@mui/icons-material")) return "mui-icons";
              if (id.includes("@mui/x-charts")) return "mui-charts";
              if (id.includes("@mui")) return "mui-vendor";
              if (id.includes("@emotion")) return "emotion";
              if (id.includes("react-dom")) return "react-vendor";
              if (id.includes("react-router")) return "react-router";
              if (id.includes("@tanstack/react-query")) return "react-query";
              if (id.includes("swiper")) return "swiper";
              if (id.includes("framer-motion")) return "framer-motion";
              if (id.includes("axios")) return "axios";
              if (id.includes("react")) return "react-vendor";
              return "vendor";
            }
          },

          assetFileNames(assetInfo) {
            const name = assetInfo.name ?? "";

            if (/\.(woff2?|ttf|otf|eot)(\?.*)?$/.test(name)) {
              return "assets/fonts/[name]-[hash][extname]";
            }

            if (/\.(png|jpe?g|svg|gif|webp|avif)(\?.*)?$/.test(name)) {
              return "assets/img/[name]-[hash][extname]";
            }

            return "assets/[name]-[hash][extname]";
          },

          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
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
        "@tanstack/react-query",
        "axios",
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
