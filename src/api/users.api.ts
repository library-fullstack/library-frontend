import axiosClient from "./axiosClient";

export interface User {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  role: "STUDENT" | "LIBRARIAN" | "MODERATOR" | "ADMIN";
  created_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  email?: string;
}

export const usersApi = {
  getProfile: () => axiosClient.get<User>("/users/profile"),

  updateProfile: (data: UpdateProfileRequest) =>
    axiosClient.patch<User>("/users/profile", data),

  changePassword: (oldPassword: string, newPassword: string) =>
    axiosClient.post("/users/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    }),
};
