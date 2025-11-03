export interface BannerConfig {
  id: string;
  image: string;
  overlay: "dark" | "light";
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  buttonColor: string;
  buttonText: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export const defaultBannerConfig: BannerConfig = {
  id: "default",
  image: "/assets/img/banner.webp",
  overlay: "dark",
  title: "Xin chào các bạn",
  subtitle: "Cùng chào mừng sự kiện khai trương thư viện trực tuyến HBH...",
  titleColor: "#ffffff",
  subtitleColor: "rgba(255,255,255,0.9)",
  buttonColor: "#ED553B",
  buttonText: "Xem thêm",
};

export const getActiveBannerConfig = async (): Promise<BannerConfig> => {
  try {
    const apiBaseUrl =
      import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
    const response = await fetch(`${apiBaseUrl}/banners/active`);

    if (!response.ok) {
      console.warn(
        "Failed to fetch active banner from API, using default",
        response.status
      );
      return defaultBannerConfig;
    }

    const data = await response.json();
    console.log("Banner from API:", data);

    const banner = data.data || data;

    if (banner && banner.image) {
      return banner as BannerConfig;
    }

    return defaultBannerConfig;
  } catch (err) {
    console.error("Failed to load banner config:", err);
    return defaultBannerConfig;
  }
};

export const bannerConfig = defaultBannerConfig;
