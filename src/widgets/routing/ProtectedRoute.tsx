import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

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
    console.log(
      "[ProtectedRoute] No auth, redirecting to login. Current location:",
      location.pathname
    );
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // kiểm tra role nếu có yêu cầu
  if (roles && !roles.includes(user.role)) {
    console.log(
      "[ProtectedRoute] Insufficient permissions. User role:",
      user.role,
      "Required:",
      roles
    );
    return <Navigate to="/" replace />;
  }

  console.log("[ProtectedRoute] Access granted for:", location.pathname);
  return children;
}
