import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
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
      ...(isProduction
        ? [
            injectPreloadTags(),
            viteCompression({
              algorithm: "gzip",
              ext: ".gz",
              threshold: 10240,
              deleteOriginFile: false,
            }),
            viteCompression({
              algorithm: "brotliCompress",
              ext: ".br",
              threshold: 10240,
              deleteOriginFile: false,
            }),
          ]
        : []),
    ],
    resolve: {
      dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
    },
    server: {
      port: 5173,
      host: "0.0.0.0",
    },
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 2000,
      sourcemap: env.VITE_SOURCEMAP === "true",
      target: "es2020",
      minify: "esbuild",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("swiper")) {
                return "swiper";
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
