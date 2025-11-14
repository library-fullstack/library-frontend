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

export const settingsApi = {
  async getSetting(key: string): Promise<SettingData | null> {
    try {
      const response = await axiosClient.get<SettingResponse>(
        `/settings/${key}`
      );
      const data = response.data.data as SettingData | null;
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
      return response.data.success;
    } catch (error) {
      logger.error("Không thể xóa cài đặt từ API:", error);
      throw error;
    }
  },
};
