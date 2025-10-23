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
  // -> nhiều khi không hoạt động. không rõ tại sao ?
  if (!token || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ok thì route đến home
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
