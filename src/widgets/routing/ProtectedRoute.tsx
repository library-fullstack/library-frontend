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
  const { user, token, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    logger.debug("[ProtectedRoute] Waiting for auth initialization...");
    return <div />;
  }

  if (import.meta.env.DEV && !user && token) {
    logger.debug(
      "[ProtectedRoute] Dev mode: have token but no user yet, waiting..."
    );
    return <div />;
  }

  if (!token || !user) {
    logger.debug("[ProtectedRoute] Unauthenticated user, redirecting to login");
    return (
      <Navigate
        to="/auth/login"
        state={{ from: { pathname: location.pathname } }}
        replace
      />
    );
  }

  // kiểm tra role nếu có yêu cầu
  if (roles && !roles.includes(user.role)) {
    logger.warn("[ProtectedRoute] User role not authorized for this route");
    return <Unauthorized />;
  }

  logger.debug("[ProtectedRoute] Access granted");
  return children;
}
