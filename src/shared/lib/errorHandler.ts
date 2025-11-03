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
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // tính số lượng điều kiện mật khẩu thoả mãn
  const validCount = [
    hasMinLength,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  // nếu hợp lệ cả 3 yêu cầu thì cho nó valid
  const isValid = hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;

  // mức độ mạnh theo chữ
  let strength: "weak" | "medium" | "strong" = "weak";
  if (validCount >= 4) strength = "strong";
  else if (validCount >= 3) strength = "medium";

  // trả về tất cả
  return {
    hasMinLength,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    isValid,
    strength,
  };
}
