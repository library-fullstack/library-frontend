import axiosClient from "../../../shared/api/axiosClient";

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_at: string;
}

export const systemSettingsApi = {
  getAll: () => {
    return axiosClient.get<{ success: boolean; data: SystemSetting[] }>(
      `/system-settings`
    );
  },

  getByKey: (key: string) => {
    return axiosClient.get<{ success: boolean; data: SystemSetting }>(
      `/system-settings/${key}`
    );
  },

  create: (data: {
    setting_key: string;
    setting_value: string;
    description?: string;
  }) => {
    return axiosClient.post<{ success: boolean; data: { id: string } }>(
      `/system-settings`,
      data
    );
  },

  update: (
    key: string,
    data: { setting_value: string; description?: string }
  ) => {
    return axiosClient.put<{ success: boolean; message: string }>(
      `/system-settings/${key}`,
      data
    );
  },

  upsert: (data: {
    setting_key: string;
    setting_value: string;
    description?: string;
  }) => {
    return axiosClient.post<{ success: boolean; message: string }>(
      `/system-settings/upsert`,
      data
    );
  },

  delete: (key: string) => {
    return axiosClient.delete<{ success: boolean; message: string }>(
      `/system-settings/${key}`
    );
  },
};
