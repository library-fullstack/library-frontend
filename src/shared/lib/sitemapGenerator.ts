export interface SitemapEntry {
  url: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  lastmod?: string;
}

export function generateSitemapXML(entries: SitemapEntry[]): string {
  const baseUrl = "https://hbh.libsys.me";

  const urlEntries = entries
    .map((entry) => {
      let xml = `  <url>\n`;
      xml += `    <loc>${baseUrl}${entry.url}</loc>\n`;
      if (entry.lastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      if (entry.changefreq) {
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      }
      if (entry.priority !== undefined) {
        xml += `    <priority>${Math.max(
          0,
          Math.min(1, entry.priority)
        )}</priority>\n`;
      }
      xml += `  </url>\n`;
      return xml;
    })
    .join("");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urlEntries +
    "</urlset>"
  );
}

export const DEFAULT_SITEMAP_ENTRIES: SitemapEntry[] = [
  {
    url: "/",
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    url: "/books",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    url: "/forum",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    url: "/about",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    url: "/contact",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    url: "/services",
    changefreq: "monthly",
    priority: 0.7,
  },
];
