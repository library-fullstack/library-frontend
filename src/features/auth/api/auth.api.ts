import axiosClient from "../../../shared/api/axiosClient";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  student_id: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: "STUDENT" | "LIBRARIAN" | "MODERATOR" | "ADMIN";
  };
  token: string;
}

// call api
export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<LoginResponse>("/auth/login", data),

  register: (data: RegisterRequest) => axiosClient.post("/auth/register", data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    axiosClient.post("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordRequest) =>
    axiosClient.post("/auth/reset-password", data),

  logout: () => axiosClient.post("/auth/logout"),

  refreshToken: () => axiosClient.post("/auth/refresh"),
};
