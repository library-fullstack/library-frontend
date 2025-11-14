import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  Database,
  HardDrive,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface SystemHealthData {
  databaseStatus: "healthy" | "warning" | "error";
  storageUsage: number;
  apiResponseTime: number;
}

interface SystemHealthProps {
  data?: SystemHealthData;
  loading?: boolean;
}

export default function SystemHealth({
  data,
  loading = false,
}: SystemHealthProps) {
  if (loading) {
    return (
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Tình trạng hệ thống
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Skeleton width="100%" height={60} sx={{ mb: 2 }} />
            <Skeleton width="100%" height={60} sx={{ mb: 2 }} />
            <Skeleton width="100%" height={60} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "healthy":
        return "Hoạt động tốt";
      case "warning":
        return "Cảnh báo";
      case "error":
        return "Lỗi";
      default:
        return "Không rõ";
    }
  };

  const getStorageColor = (usage: number): "success" | "warning" | "error" => {
    if (usage < 60) return "success";
    if (usage < 80) return "warning";
    return "error";
  };

  const getResponseTimeColor = (
    time: number
  ): "success" | "warning" | "error" => {
    if (time < 200) return "success";
    if (time < 500) return "warning";
    return "error";
  };

  const mockData: SystemHealthData = data || {
    databaseStatus: "healthy",
    storageUsage: 45,
    apiResponseTime: 150,
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Tình trạng hệ thống
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Database size={20} color="#4F46E5" />
                <Typography variant="body2" fontWeight={600}>
                  Cơ sở dữ liệu
                </Typography>
              </Box>
              <Chip
                icon={
                  mockData.databaseStatus === "healthy" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )
                }
                label={getStatusLabel(mockData.databaseStatus)}
                size="small"
                color={getStatusColor(mockData.databaseStatus)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Kết nối ổn định, không có lỗi
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HardDrive size={20} color="#10B981" />
                <Typography variant="body2" fontWeight={600}>
                  Dung lượng lưu trữ
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={600}
                color={`${getStorageColor(mockData.storageUsage)}.main`}
              >
                {mockData.storageUsage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={mockData.storageUsage}
              color={getStorageColor(mockData.storageUsage)}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              {(mockData.storageUsage * 10).toFixed(1)} GB / 1 TB sử dụng
            </Typography>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Zap size={20} color="#F59E0B" />
                <Typography variant="body2" fontWeight={600}>
                  Thời gian phản hồi API
                </Typography>
              </Box>
              <Chip
                label={`${mockData.apiResponseTime}ms`}
                size="small"
                color={getResponseTimeColor(mockData.apiResponseTime)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Tốc độ phản hồi trung bình từ server
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
