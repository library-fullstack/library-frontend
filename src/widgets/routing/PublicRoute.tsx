import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactElement;
}

export default function PublicRoute({
  children,
}: PublicRouteProps): React.ReactElement {
  const { user, token } = useAuth();
  const location = useLocation();
  // nếu đã đăng nhập, redirect về home
  if (token && user) {
    const from = (location.state as { from?: { pathname: string } } | null)
      ?.from?.pathname;
    console.log(
      "[PublicRoute] Already logged in, redirecting to:",
      from || "/"
    );
    return <Navigate to={from || "/"} replace />;
  }

  console.log("[PublicRoute] Truy cập được chấp nhận (chưa đăng nhập)");
  return children;
}
