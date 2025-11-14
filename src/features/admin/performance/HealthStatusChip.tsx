import React from "react";
import { Box, Chip } from "@mui/material";
import { CheckCircle, Warning, Error as ErrorIcon } from "@mui/icons-material";
import type { HealthData } from "./types";

interface HealthStatusChipProps {
  health: HealthData | null;
}

export default function HealthStatusChip({ health }: HealthStatusChipProps) {
  const getHealthStatus = () => {
    if (!health)
      return { color: "default" as const, icon: null, label: "Đang tải..." };

    switch (health.status) {
      case "healthy":
        return {
          color: "success" as const,
          icon: <CheckCircle />,
          label: "Khỏe mạnh",
        };
      case "degraded":
        return {
          color: "warning" as const,
          icon: <Warning />,
          label: "Giảm hiệu suất",
        };
      case "unhealthy":
        return {
          color: "error" as const,
          icon: <ErrorIcon />,
          label: "Có vấn đề",
        };
      default:
        return { color: "default" as const, icon: null, label: "Unknown" };
    }
  };

  const status = getHealthStatus();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Chip
        {...(status.icon && { icon: status.icon })}
        label={status.label}
        color={status.color}
        size="small"
      />
      {health && (
        <Chip
          label={`Uptime: ${Math.floor(health.uptime / 3600)}h ${Math.floor(
            (health.uptime % 3600) / 60
          )}m`}
          size="small"
          variant="outlined"
        />
      )}
    </Box>
  );
}
