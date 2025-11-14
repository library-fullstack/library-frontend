import { Suspense, ComponentType, LazyExoticComponent } from "react";
import { Box, Skeleton } from "@mui/material";

interface LazyLoadProps {
  component: LazyExoticComponent<ComponentType<Record<string, unknown>>>;
  fallback?: React.ReactNode;
}

export function LoadingFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        width: "100%",
      }}
    >
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
  );
}

export function LazyLoad({ component: Component, fallback }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <Component />
    </Suspense>
  );
}
