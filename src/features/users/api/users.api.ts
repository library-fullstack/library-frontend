import axiosClient from "../../../shared/api/axiosClient";

export interface User {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  role: "STUDENT" | "LIBRARIAN" | "MODERATOR" | "ADMIN";
  avatar_url?: string;
  created_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  email?: string;
}

export const usersApi = {
  // lấy thông tin của user
  getProfile: () => axiosClient.get<User>("/users/profile"),

  // cập nhật thông tin cơ bản ( hiện tại khoá )
  updateProfile: (data: UpdateProfileRequest) =>
    axiosClient.patch<User>("/users/profile", data),

  // đổi mật khẩu
  changePassword: (oldPassword: string, newPassword: string) =>
    axiosClient.post("/users/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    }),

  // thay avatar
  updateAvatar: (data: FormData) =>
    axiosClient.patch<User>("/users/profile/avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  checkPassword: (password: string) =>
    axiosClient.post("/users/check-password", { password }),

  sendOtp: (type: "change_password" | "password_reset") =>
    axiosClient.post("/auth/send-otp", { type }),

  verifyChangePassword: (data: {
    old_password: string;
    new_password: string;
    otp_code: string;
  }) => axiosClient.post("/users/change-password/verify", data),
};
