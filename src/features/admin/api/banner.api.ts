import axiosClient from "../../../shared/api/axiosClient";
import { camelToSnake, snakeToCamel } from "../../../shared/lib/case-converter";
import logger from "@/shared/lib/logger";

export interface BannerData {
  id?: string;
  image: string;
  cloudinary_id?: string;
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

export interface BannerResponse {
  success: boolean;
  message: string;
  data?: BannerData | BannerData[] | { url: string; public_id: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BannerListResponse {
  success: boolean;
  message: string;
  data: {
    banners: BannerData[];
    pagination: PaginationMeta;
  };
}

const activeBannerCache = { data: null as BannerData | null, timestamp: 0 };
const ACTIVE_BANNER_TTL = 5 * 60 * 1000; // 5 minutes

const isBannerCacheValid = (): boolean => {
  return Date.now() - activeBannerCache.timestamp < ACTIVE_BANNER_TTL;
};

export const bannerApi = {
  async getAllBanners(
    page: number = 1,
    limit: number = 50
  ): Promise<BannerData[]> {
    try {
      const response = await axiosClient.get<BannerListResponse>(
        `/banners?page=${page}&limit=${limit}`
      );
      const banners = response.data.data?.banners || [];
      return banners.map(
        (banner) =>
          snakeToCamel(
            banner as unknown as Record<string, unknown>
          ) as BannerData
      );
    } catch (error) {
      logger.error("Không thể lấy banner đang hoạt động từ API:", error);
      throw error;
    }
  },

  async getActiveBanner(): Promise<BannerData | null> {
    try {
      if (isBannerCacheValid() && activeBannerCache.data) {
        logger.log("[BannerAPI] Using cached active banner");
        return activeBannerCache.data;
      }

      const response = await axiosClient.get<BannerResponse>(`/banners/active`);
      const banner = response.data.data as BannerData | undefined;
      if (!banner) return null;

      const convertedBanner = snakeToCamel(
        banner as unknown as Record<string, unknown>
      ) as BannerData;

      activeBannerCache.data = convertedBanner;
      activeBannerCache.timestamp = Date.now();

      return convertedBanner;
    } catch (error) {
      logger.error("Không thể lấy banner đang hoạt động từ API:", error);
      return null;
    }
  },

  async getBannerById(id: string): Promise<BannerData | null> {
    try {
      const response = await axiosClient.get<BannerResponse>(`/banners/${id}`);
      const banner = response.data.data as BannerData | undefined;
      if (!banner) return null;
      return snakeToCamel(
        banner as unknown as Record<string, unknown>
      ) as BannerData;
    } catch (error) {
      logger.error("Không thể lấy banner từ API:", error);
      throw error;
    }
  },

  async uploadBannerImage(
    file: File
  ): Promise<{ url: string; public_id: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosClient.post<BannerResponse>(
        `/admin/banners/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data as { url: string; public_id: string };
    } catch (error) {
      logger.error("Không thể tải lên hình ảnh:", error);
      throw error;
    }
  },

  async createBanner(banner: BannerData): Promise<BannerResponse> {
    try {
      const response = await axiosClient.post<BannerResponse>(
        `/admin/banners`,
        camelToSnake(banner as unknown as Record<string, unknown>)
      );
      const data = response.data.data as BannerData | undefined;

      activeBannerCache.data = null;
      activeBannerCache.timestamp = 0;

      return {
        ...response.data,
        data: data
          ? (snakeToCamel(
              data as unknown as Record<string, unknown>
            ) as BannerData)
          : undefined,
      };
    } catch (error) {
      logger.error("Không thể tạo banner từ API:", error);
      throw error;
    }
  },

  async updateBanner(
    id: string,
    banner: Partial<BannerData>
  ): Promise<BannerResponse> {
    try {
      const response = await axiosClient.put<BannerResponse>(
        `/admin/banners/${id}`,
        camelToSnake(banner as unknown as Record<string, unknown>)
      );
      const data = response.data.data as BannerData | undefined;

      activeBannerCache.data = null;
      activeBannerCache.timestamp = 0;

      return {
        ...response.data,
        data: data
          ? (snakeToCamel(
              data as unknown as Record<string, unknown>
            ) as BannerData)
          : undefined,
      };
    } catch (error) {
      logger.error("Không thể cập nhật banner từ API:", error);
      throw error;
    }
  },

  async deleteBanner(id: string): Promise<BannerResponse> {
    try {
      const response = await axiosClient.delete<BannerResponse>(
        `/admin/banners/${id}`
      );

      activeBannerCache.data = null;
      activeBannerCache.timestamp = 0;

      return response.data as BannerResponse;
    } catch (error) {
      logger.error("Không thể xóa banner từ API:", error);
      throw error;
    }
  },

  async toggleBannerStatus(
    id: string,
    isActive: boolean
  ): Promise<BannerResponse> {
    try {
      const response = await axiosClient.patch<BannerResponse>(
        `/admin/banners/${id}/status`,
        { is_active: isActive }
      );
      const data = response.data.data as BannerData | undefined;

      activeBannerCache.data = null;
      activeBannerCache.timestamp = 0;

      return {
        ...response.data,
        data: data
          ? (snakeToCamel(
              data as unknown as Record<string, unknown>
            ) as BannerData)
          : undefined,
      };
    } catch (error) {
      logger.error("Không thể thay đổi trạng thái banner từ API:", error);
      throw error;
    }
  },

  clearCache(): void {
    activeBannerCache.data = null;
    activeBannerCache.timestamp = 0;
  },
};
