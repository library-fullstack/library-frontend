import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import Unauthorized from "../../shared/ui/Unauthorized";
import logger from "../../shared/lib/logger";

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: string[];
}

// lớp bảo vệ
export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps): React.ReactElement {
  const { user, token } = useAuth();
  const location = useLocation();

  // chưa đăng nhập, chưa có token thì route đến đăng nhập
  // lưu location hiện tại để redirect về sau khi đăng nhập
  if (!token || !user) {
    logger.log(
      "[ProtectedRoute] Chưa xác thực, đang chuyển hướng đến trang đăng nhập. Vị trí hiện tại:",
      location.pathname
    );
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // kiểm tra role nếu có yêu cầu
  if (roles && !roles.includes(user.role)) {
    logger.log(
      "[ProtectedRoute] Quyền truy cập không đủ. Vai trò người dùng:",
      user.role,
      "Yêu cầu:",
      roles
    );
    return <Unauthorized />;
  }

  logger.log(
    "[ProtectedRoute] Quyền truy cập được cấp cho:",
    location.pathname
  );
  return children;
}
