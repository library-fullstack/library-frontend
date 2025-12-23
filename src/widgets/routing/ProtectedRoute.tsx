import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import Unauthorized from "../../shared/ui/Unauthorized";

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
    return <div />;
  }

  if (import.meta.env.DEV && !user && token) {
    return <div />;
  }

  if (!token || !user) {
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
    return <Unauthorized />;
  }

  return children;
}
