import axiosClient from "../../../shared/api/axiosClient";
import logger from "@/shared/lib/logger";

export interface SettingData {
  id?: string;
  setting_key: string;
  setting_value: string;
  allow_student_info_edit?: boolean;
  description?: string;
  updated_at?: string;
}

export interface SettingResponse {
  success: boolean;
  message: string;
  data?: SettingData | SettingData[];
}

const settingsCache = new Map<
  string,
  { data: SettingData | null; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (key: string): boolean => {
  const cached = settingsCache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_TTL;
};

export const settingsApi = {
  async getSetting(key: string): Promise<SettingData | null> {
    try {
      if (isCacheValid(key)) {
        logger.log(`[SettingsAPI] Using cached setting: ${key}`);
        return settingsCache.get(key)?.data ?? null;
      }

      const response = await axiosClient.get<SettingResponse>(
        `/settings/${key}`
      );
      const data = response.data.data as SettingData | null;

      settingsCache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      logger.error("Không thể lấy cài đặt từ API:", error);
      return null;
    }
  },

  async getAllSettings(): Promise<SettingData[]> {
    try {
      const response = await axiosClient.get<SettingResponse>(
        "/admin/settings"
      );
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      logger.error("Không thể lấy tất cả cài đặt từ API:", error);
      return [];
    }
  },

  async updateSetting(
    key: string,
    value: string,
    description?: string
  ): Promise<SettingData | null> {
    try {
      const response = await axiosClient.put<SettingResponse>(
        `/admin/settings/${key}`,
        { setting_value: value, description }
      );
      const data = response.data.data as SettingData | null;

      settingsCache.delete(key);
      return data;
    } catch (error) {
      logger.error("Không thể cập nhật cài đặt từ API:", error);
      throw error;
    }
  },

  async toggleSetting(key: string): Promise<boolean | null> {
    try {
      const response = await axiosClient.patch<SettingResponse>(
        `/admin/settings/${key}/toggle`
      );
      const data = response.data.data as SettingData | undefined;

      settingsCache.delete(key);
      return data ? JSON.parse(data.setting_value) : null;
    } catch (error) {
      logger.error("Không thể thay đổi trạng thái cài đặt từ API:", error);
      throw error;
    }
  },

  async deleteSetting(key: string): Promise<boolean> {
    try {
      const response = await axiosClient.delete<SettingResponse>(
        `/admin/settings/${key}`
      );

      settingsCache.delete(key);
      return response.data.success;
    } catch (error) {
      logger.error("Không thể xóa cài đặt từ API:", error);
      throw error;
    }
  },

  clearCache(key?: string): void {
    if (key) {
      settingsCache.delete(key);
    } else {
      settingsCache.clear();
    }
  },
};
