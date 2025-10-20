import axiosClient from "./axiosClient";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  student_id: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    role: "STUDENT" | "LIBRARIAN" | "MODERATOR" | "ADMIN";
  };
}

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<LoginResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<LoginResponse>("/auth/register", data),

  logout: () => axiosClient.post("/auth/logout"),

  refreshToken: () => axiosClient.post("/auth/refresh"),
};
