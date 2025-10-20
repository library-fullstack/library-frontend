import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactElement;
}

/**
 * PublicRoute - Bảo vệ các trang public (login, register)
 * Nếu user đã đăng nhập → redirect về home
 * Nếu chưa đăng nhập → cho phép truy cập
 */
export default function PublicRoute({
  children,
}: PublicRouteProps): React.ReactElement {
  const { user, token } = useAuth();

  // Nếu đã đăng nhập, redirect về home
  if (token && user) {
    return <Navigate to="/" replace />;
  }

  // Chưa đăng nhập, cho phép truy cập
  return children;
}
