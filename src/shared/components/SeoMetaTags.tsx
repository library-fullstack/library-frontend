import { Helmet } from "react-helmet-async";
import { useMemo } from "react";

interface SeoMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "book";
  author?: string;
  canonical?: string;
}

export default function SeoMetaTags({
  title = "Thư viện trực tuyến HBH - Hệ thống mượn sách online của HBH",
  description = "HBH Library - Nền tảng thư viện trực tuyến dành cho sinh viên HBH. Tìm kiếm, đặt mượn và thảo luận sách dễ dàng, nhanh chóng và hiện đại.",
  keywords = "HBH, thư viện trực tuyến, mượn sách, sách UNETI, thư viện HBH, sách học tập, sách nghiên cứu, đọc sách online",
  image = "https://hbh.libsys.me/log.webp",
  url = typeof window !== "undefined"
    ? window.location.href
    : "https://hbh.libsys.me",
  type = "website",
  author = "HBH Library Team",
  canonical,
}: SeoMetaProps) {
  const sanitizedData = useMemo(
    () => ({
      title: title.slice(0, 70),
      description: description.slice(0, 160),
      keywords: keywords.slice(0, 160),
      image,
      url,
      type,
      author,
      canonical: canonical || url,
    }),
    [title, description, keywords, image, url, type, author, canonical]
  );

  return (
    <Helmet>
      <title>{sanitizedData.title}</title>
      <meta name="description" content={sanitizedData.description} />
      <meta name="keywords" content={sanitizedData.keywords} />
      <meta name="author" content={sanitizedData.author} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="canonical" href={sanitizedData.canonical} />

      <meta property="og:type" content={sanitizedData.type} />
      <meta property="og:site_name" content="Thư viện trực tuyến HBH" />
      <meta property="og:url" content={sanitizedData.url} />
      <meta property="og:title" content={sanitizedData.title} />
      <meta property="og:description" content={sanitizedData.description} />
      <meta property="og:image" content={sanitizedData.image} />
      <meta property="og:image:alt" content={sanitizedData.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hbh_library" />
      <meta name="twitter:title" content={sanitizedData.title} />
      <meta name="twitter:description" content={sanitizedData.description} />
      <meta name="twitter:image" content={sanitizedData.image} />

      <meta name="robots" content="index, follow" />
      <meta name="language" content="vi" />
      <meta name="revisit-after" content="7 days" />

      <meta name="theme-color" content="#1b1c22" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Library",
          name: "Thư viện trực tuyến HBH",
          url: "https://hbh.libsys.me",
          description: sanitizedData.description,
          image: sanitizedData.image,
          sameAs: [
            "https://www.facebook.com/hbh.library",
            "https://hbh.libsys.me",
          ],
          potentialAction: {
            "@type": "SearchAction",
            target: "https://hbh.libsys.me/books?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        })}
      </script>
    </Helmet>
  );
}
