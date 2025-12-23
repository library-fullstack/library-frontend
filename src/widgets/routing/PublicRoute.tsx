import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { LocationState } from "../../shared/types/router";
import useAuth from "../../features/auth/hooks/useAuth";
import logger from "../../shared/lib/logger";

interface PublicRouteProps {
  children: React.ReactElement;
}

export default function PublicRoute({
  children,
}: PublicRouteProps): React.ReactElement {
  const { user, token, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <div />;
  }

  // nếu đã đăng nhập, redirect về home
  if (token && user) {
    const from = (location.state as LocationState | null)?.from?.pathname;
    logger.log("[PublicRoute] Already logged in, redirecting to:", from || "/");
    return <Navigate to={from || "/"} replace />;
  }
  return children;
}
