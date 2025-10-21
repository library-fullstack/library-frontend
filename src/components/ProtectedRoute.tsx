import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

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

  // chưa đăng nhập, chưa có token thì route đến đăng nhập
  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // ok thì route đến home
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
