import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactElement;
}

export default function PublicRoute({
  children,
}: PublicRouteProps): React.ReactElement {
  const { user, token } = useAuth();

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
