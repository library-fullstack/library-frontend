import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
  useTheme,
} from "@mui/material";
import { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  loading?: boolean;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}

export default function StatisticsCard({
  title,
  value,
  icon: Icon,
  trend,
  loading = false,
  color = "primary",
}: StatisticsCardProps) {
  const theme = useTheme();

  const colorMap = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: "#F59E0B",
    info: "#3B82F6",
  };

  const bgColorMap = {
    primary:
      theme.palette.mode === "dark"
        ? "rgba(129, 140, 248, 0.1)"
        : "rgba(79, 70, 229, 0.08)",
    secondary:
      theme.palette.mode === "dark"
        ? "rgba(251, 191, 36, 0.1)"
        : "rgba(245, 158, 11, 0.08)",
    success:
      theme.palette.mode === "dark"
        ? "rgba(16, 185, 129, 0.1)"
        : "rgba(16, 185, 129, 0.08)",
    error:
      theme.palette.mode === "dark"
        ? "rgba(248, 113, 113, 0.1)"
        : "rgba(239, 68, 68, 0.08)",
    warning:
      theme.palette.mode === "dark"
        ? "rgba(245, 158, 11, 0.1)"
        : "rgba(245, 158, 11, 0.08)",
    info:
      theme.palette.mode === "dark"
        ? "rgba(59, 130, 246, 0.1)"
        : "rgba(59, 130, 246, 0.08)",
  };

  if (loading) {
    return (
      <Card elevation={0}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={24} />
              <Skeleton width="40%" height={48} sx={{ mt: 1 }} />
              <Skeleton width="50%" height={20} sx={{ mt: 1 }} />
            </Box>
            <Skeleton variant="circular" width={56} height={56} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: colorMap[color],
                mb: trend ? 1 : 0,
              }}
            >
              {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
            </Typography>
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: trend.isPositive
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    fontWeight: 600,
                  }}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trend.label}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: bgColorMap[color],
              flexShrink: 0,
            }}
          >
            <Icon size={28} color={colorMap[color]} strokeWidth={2} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
