import logger from "./logger";

export interface AppError {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
  isNetworkError?: boolean;
  isRetryable?: boolean;
}
export function isNetworkError(error: unknown): boolean {
  const err = error as Record<string, unknown>;
  return (
    err.code === "ECONNABORTED" ||
    err.code === "ENOTFOUND" ||
    err.code === "ENETUNREACH" ||
    err.message === "Network Error" ||
    !err.response
  );
}

export function isRetryableError(error: unknown): boolean {
  if (isNetworkError(error)) return true;

  const err = error as Record<string, unknown>;
  const response = err.response as Record<string, unknown> | undefined;
  const status = response?.status as number | undefined;

  if (!status) return true;

  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

export function getRetryDelay(attemptIndex: number, baseDelay = 1000): number {
  const delay = baseDelay * Math.pow(2, attemptIndex);
  return Math.min(delay, 30000);
}

export function parseError(error: unknown): AppError {
  logger.error("[parseError] Parsing error:", error);

  const err = error as Record<string, unknown>;

  if (err.response) {
    const response = err.response as Record<string, unknown>;
    const status = response.status as number;
    const data = response.data as Record<string, unknown> | undefined;

    const message =
      (data?.message as string) ||
      (data?.error as string) ||
      getStatusMessage(status);

    return {
      message,
      code: getStatusCode(status),
      statusCode: status,
      details: data?.details || data?.errors,
      isNetworkError: false,
      isRetryable: isRetryableError(error),
    };
  }

  if (isNetworkError(error)) {
    return {
      message: "Không có kết nối mạng. Vui lòng kiểm tra internet.",
      code: "NETWORK_ERROR",
      statusCode: 0,
      isNetworkError: true,
      isRetryable: true,
    };
  }

  if (err.code === "ECONNABORTED") {
    return {
      message: "Yêu cầu hết thời gian chờ. Vui lòng thử lại.",
      code: "TIMEOUT",
      statusCode: 408,
      isNetworkError: true,
      isRetryable: true,
    };
  }

  return {
    message: (err.message as string) || "Có lỗi xảy ra",
    code: "UNKNOWN_ERROR",
    statusCode: -1,
    details: error,
    isNetworkError: false,
    isRetryable: false,
  };
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "Yêu cầu không hợp lệ";
    case 401:
      return "Phiên đã hết hạn. Vui lòng đăng nhập lại.";
    case 403:
      return "Bạn không có quyền truy cập.";
    case 404:
      return "Không tìm thấy dữ liệu.";
    case 429:
      return "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
    case 500:
      return "Lỗi máy chủ. Vui lòng thử lại sau.";
    case 503:
      return "Máy chủ đang bảo trì. Vui lòng thử lại sau.";
    default:
      return `Lỗi ${status}. Vui lòng thử lại.`;
  }
}

function getStatusCode(status: number): string {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 429:
      return "RATE_LIMITED";
    case 500:
      return "SERVER_ERROR";
    case 503:
      return "SERVICE_UNAVAILABLE";
    default:
      return "HTTP_ERROR";
  }
}

export function getUserFriendlyMessage(error: AppError): string {
  if (error.isNetworkError) {
    return "Mất kết nối. Kiểm tra internet của bạn.";
  }

  if (error.statusCode >= 500) {
    return "Có lỗi xảy ra. Vui lòng thử lại sau.";
  }

  return error.message;
}

export function shouldShowRetryButton(error: AppError): boolean {
  return (
    error.isNetworkError || error.statusCode === 429 || error.statusCode >= 500
  );
}

export function parseApiError(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    "message" in error
  ) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const message =
      axiosError.response?.data?.message || axiosError.message || "";
    return processErrorMessage(message);
  }

  if (error instanceof Error) {
    return processErrorMessage(error.message);
  }

  return "Có lỗi xảy ra. Vui lòng thử lại sau.";
}

function processErrorMessage(message: string): string {
  if (!message) return "Có lỗi xảy ra. Vui lòng thử lại sau.";

  // xử lí cái cấu trúc lỗi của axios
  // kiểm tra lỗi liên quan đến SQL
  // thay vì in lỗi của SQL ra thì thay vào đó là trả về lỗi do hệ thống
  if (
    message.toLowerCase().includes("sql") ||
    message.toLowerCase().includes("syntax") ||
    message.toLowerCase().includes("mysql") ||
    message.toLowerCase().includes("sqlite") ||
    message.toLowerCase().includes("postgres") ||
    message.toLowerCase().includes("duplicate entry") ||
    message.toLowerCase().includes("foreign key")
  ) {
    return "Có lỗi xảy ra với hệ thống. Vui lòng thử lại sau.";
  }

  // xử lí các trường hợp lỗi thông thường
  if (message.toLowerCase().includes("not found")) {
    return "Không tìm thấy thông tin yêu cầu.";
  }

  // lỗi token hết hạn
  if (
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("unauthenticated")
  ) {
    return "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
  }

  // lỗi về quyền
  if (
    message.toLowerCase().includes("forbidden") ||
    message.toLowerCase().includes("permission")
  ) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }

  // lỗi kết nối internet
  if (
    message.toLowerCase().includes("network") ||
    message.toLowerCase().includes("timeout")
  ) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.";
  }

  // lỗi tồn tại khi đăng ký, để nguyên
  if (
    message.toLowerCase().includes("already exists") ||
    message.toLowerCase().includes("đã tồn tại")
  ) {
    return message;
  }

  // xử lí lỗi xác thực
  if (
    message.toLowerCase().includes("validation") ||
    message.toLowerCase().includes("invalid")
  ) {
    return message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
  }

  // lỗi không rõ
  // tạm thời để vậy
  if (
    message &&
    message.length < 100 &&
    !message.includes("Error:") &&
    !message.includes("Exception")
  ) {
    return message;
  }

  // mặc định fallback
  return "Có lỗi xảy ra. Vui lòng thử lại sau.";
}

// interface độ mạnh của mật khẩu
export interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
}

// kiểm tra mật khẩu
export function validatePassword(password: string): PasswordValidation {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const validCount = [
    hasMinLength,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  const isValid = hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;

  let strength: "weak" | "medium" | "strong" = "weak";
  if (validCount >= 4) strength = "strong";
  else if (validCount >= 3) strength = "medium";

  return {
    hasMinLength,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    isValid,
    strength,
  };
}
