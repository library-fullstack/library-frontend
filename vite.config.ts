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
      dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 5173,
      host: "0.0.0.0",
      hmr: {
        host: "localhost",
        port: 5173,
        protocol: "ws",
      },
      middlewareMode: false,
      cors: {
        origin: "*",
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        allowedHeaders: ["*"],
      },
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 2000,
      sourcemap: false,
      target: "es2020",
      minify: "esbuild",
      cssCodeSplit: true,
      cssMinify: true,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("@mui/material")) {
                return "mui-material";
              }
              if (id.includes("@mui/icons-material")) {
                return "mui-icons";
              }
              if (id.includes("@mui/x-charts")) {
                return "mui-charts";
              }
              if (id.includes("@emotion")) {
                return "emotion";
              }
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
              if (id.includes("react-router")) {
                return "react-router";
              }
              if (id.includes("@tanstack/react-query")) {
                return "react-query";
              }
              if (id.includes("swiper")) {
                return "swiper";
              }
              if (id.includes("framer-motion")) {
                return "framer-motion";
              }
              if (id.includes("axios")) {
                return "axios";
              }
              return "vendor";
            }
          },
          assetFileNames: (assetInfo) => {
            if (
              assetInfo.name &&
              /\.(woff2?|ttf|otf|eot)$/.test(assetInfo.name)
            ) {
              return "assets/fonts/[name]-[hash][extname]";
            }
            if (
              assetInfo.name &&
              /\.(png|jpe?g|svg|gif|webp|avif)$/.test(assetInfo.name)
            ) {
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
      holdDeps: ["react-activation", "react-helmet-async"],
    },
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
