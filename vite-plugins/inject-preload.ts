import type { Plugin } from "vite";

export function injectPreloadTags(): Plugin {
  return {
    name: "inject-preload-tags",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        if (ctx.bundle) {
          const preloadTags = `
              <!-- preload critical assets -->
              <link rel="preload" as="image" href="/assets/img/banner.webp" fetchpriority="high" />
              <link rel="preload" as="image" href="/assets/img/logo.webp" />
              <link rel="preload" as="font" type="font/woff2" href="https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2" crossorigin />
          `;

          return html.replace(
            "<!-- optimized fonts",
            `${preloadTags}\n    <!-- optimized fonts`
          );
        }
        return html;
      },
    },
  };
}
