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
    },

    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
