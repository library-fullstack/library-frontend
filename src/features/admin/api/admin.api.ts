import axiosClient from "../../../shared/api/axiosClient";

export interface SystemSettingsResponse {
  allow_student_info_edit: boolean;
}

export const adminApi = {
  getSystemSettings: () =>
    axiosClient.get<SystemSettingsResponse>("/admin/system/settings"),

  updateSystemSettings: (data: { allow_student_info_edit: boolean }) =>
    axiosClient.patch<SystemSettingsResponse>("/admin/system/settings", data),
};
