import axiosClient from "../../../shared/api/axiosClient";
import StorageUtil from "../../../shared/lib/storage";

export interface User {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  role: "STUDENT" | "LIBRARIAN" | "MODERATOR" | "ADMIN";
  avatar_url?: string;
  created_at: string;
  phone?: string;
  class_name?: string;
  faculty?: string;
  major?: string;
  admission_year?: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  class_name?: string;
  faculty?: string;
  major?: string;
  admission_year?: string;
}

export const usersApi = {
  getMe: async () => {
    const token = StorageUtil.getItem("token");
    if (!token) throw new Error("No token available for getMe()");

    try {
      return await axiosClient.get<User>("/users/profile");
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        StorageUtil.removeItem("token");
        StorageUtil.removeItem("user");
        throw new Error("Token invalid or expired - 401");
      }
      throw error;
    }
  },

  // cập nhật thông tin người dùng
  updateProfile: (data: UpdateProfileRequest) =>
    axiosClient.patch<User>("/users/profile", data),

  // đổi mật khẩu (nếu không dùng OTP)
  changePassword: (oldPassword: string, newPassword: string) =>
    axiosClient.post("/users/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    }),

  // cập nhật ảnh đại diện
  updateAvatar: (data: FormData) =>
    axiosClient.patch<User>("/users/profile/avatar", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // kiểm tra mật hiện tại - hỗ trợ đổi mật khẩu
  checkPassword: (password: string) =>
    axiosClient.post("/users/check-password", { password }),

  // gửi OTP đổi mật khẩu
  sendOtp: (type: "change_password" | "password_reset") =>
    axiosClient.post("/auth/send-otp", { type }),

  // đổi mật khẩu bằng OTP
  verifyChangePassword: (data: {
    old_password: string;
    new_password: string;
    otp_code: string;
  }) => axiosClient.post("/users/change-password/verify", data),
};
