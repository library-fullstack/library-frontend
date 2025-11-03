import axiosClient from "../../shared/api/axiosClient";
import logger from "../../shared/lib/logger";

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
    const response = await axiosClient.get<{
      success: boolean;
      data: BannerConfig;
    }>("/banners/active");

    logger.log("Banner từ API:", response.data);

    const banner =
      response.data.data || (response.data as unknown as BannerConfig);

    if (banner && banner.image) {
      return banner as BannerConfig;
    }

    return defaultBannerConfig;
  } catch (err) {
    logger.error("Không thể tải cấu hình banner:", err);
    return defaultBannerConfig;
  }
};

export const bannerConfig = defaultBannerConfig;
