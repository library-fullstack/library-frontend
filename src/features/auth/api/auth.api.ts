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
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
  require_info_confirm: boolean;
  token?: string;
  user_preview?: {
    student_id: string;
    full_name: string;
    email: string;
    phone: string;
  };
}

// gọi api auth
export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<LoginResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<RegisterResponse>("/auth/register", data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    axiosClient.post("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordRequest) =>
    axiosClient.post("/auth/reset-password", data),

  logout: () => axiosClient.post("/auth/logout"),

  refreshToken: () => axiosClient.post("/auth/refresh"),

  sendOtp: (data: { type: "forgot_password" | "change_password" }) =>
    axiosClient.post("/auth/send-otp", data),
};
