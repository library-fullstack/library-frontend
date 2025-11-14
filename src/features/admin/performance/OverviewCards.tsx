import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Speed, Memory, Storage } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import type { AllMetrics } from "./types";

interface OverviewCardsProps {
  metrics: AllMetrics | null;
}

export default function OverviewCards({ metrics }: OverviewCardsProps) {
  const theme = useTheme();

  if (!metrics) return null;

  return (
    <>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.5, sm: 2.5 },
              px: { xs: 1, sm: 2.5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              "&:last-child": {
                pb: { xs: 1.5, sm: 2.5 },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Speed sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="body2" color="text.secondary">
                Tổng số yêu cầu
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {metrics.performance.summary.totalRequests.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Từ khi khởi động
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.info.main,
              0.1
            )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.5, sm: 2.5 },
              px: { xs: 1, sm: 2.5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              "&:last-child": {
                pb: { xs: 1.5, sm: 2.5 },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Memory sx={{ mr: 1, color: theme.palette.info.main }} />
              <Typography variant="body2" color="text.secondary">
                Thời gian phản hồi TB
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {metrics.performance.summary.avgDuration}ms
            </Typography>
            <Typography
              variant="caption"
              color={
                metrics.performance.summary.avgDuration < 100
                  ? "success.main"
                  : "text.secondary"
              }
              sx={{ mt: 1 }}
            >
              {metrics.performance.summary.avgDuration < 100
                ? "Xuất sắc"
                : metrics.performance.summary.avgDuration < 300
                ? "Tốt"
                : metrics.performance.summary.avgDuration < 500
                ? "Trung bình"
                : "Cần cải thiện"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.success.main,
              0.1
            )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.5, sm: 2.5 },
              px: { xs: 1, sm: 2.5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              "&:last-child": {
                pb: { xs: 1.5, sm: 2.5 },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Storage sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ trúng Cache
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {metrics.cache.hitRate}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(metrics.cache.hitRate || "0")}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                {metrics.cache.hits + metrics.cache.misses} requests
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.warning.main,
              0.1
            )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.5, sm: 2.5 },
              px: { xs: 1, sm: 2.5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              "&:last-child": {
                pb: { xs: 1.5, sm: 2.5 },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Storage sx={{ mr: 1, color: theme.palette.warning.main }} />
              <Typography variant="body2" color="text.secondary">
                Database Pool
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {metrics.database.utilizationPercent.toFixed(0)}%
            </Typography>
            <Typography
              variant="caption"
              color={
                metrics.database.utilizationPercent > 80
                  ? "error.main"
                  : metrics.database.utilizationPercent > 60
                  ? "warning.main"
                  : "text.secondary"
              }
            >
              {metrics.database.activeConnections} /{" "}
              {metrics.database.maxConnections} kết nối
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
