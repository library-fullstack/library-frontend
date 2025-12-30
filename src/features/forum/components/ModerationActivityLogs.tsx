import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import { activityLogsApi } from "../../admin/api/activityLogs.api";
import type { ActivityLog } from "../../admin/api/activityLogs.api";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ActivityLogsProps {
  onLogsUpdated?: () => void;
}

const ActivityLogsList: React.FC<ActivityLogsProps> = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await activityLogsApi.getRecentActivities(50);
      // Filter chỉ lấy logs liên quan đến FORUM
      const forumLogs = (response.data.data || []).filter(
        (log) => log.type.toUpperCase() === "FORUM"
      );
      setLogs(forumLogs);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
      setError("Không thể tải nhật ký hoạt động");
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "FORUM":
        return "primary";
      case "BOOK":
        return "success";
      case "BORROW":
        return "warning";
      case "USER":
        return "info";
      case "SYSTEM":
        return "error";
      default:
        return "default";
    }
  };

  const getActionLabel = (type: string) => {
    switch (type.toUpperCase()) {
      case "FORUM":
        return "Diễn đàn";
      case "BOOK":
        return "Sách";
      case "BORROW":
        return "Mượn trả";
      case "USER":
        return "Người dùng";
      case "SYSTEM":
        return "Hệ thống";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Nhật ký hoạt động hệ thống
      </Typography>

      {logs.length === 0 ? (
        <Alert severity="info">Không có hoạt động nào được ghi lại</Alert>
      ) : (
        <Stack spacing={1}>
          {logs.map((log) => (
            <Card key={log.id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                  >
                    {log.user_name?.charAt(0).toUpperCase() || "S"}
                  </Avatar>

                  <Box flex={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {log.user_name || "Hệ thống"}
                      </Typography>
                      <Chip
                        label={getActionLabel(log.type)}
                        size="small"
                        color={
                          getActionColor(log.type) as
                            | "primary"
                            | "success"
                            | "warning"
                            | "info"
                            | "error"
                            | "default"
                        }
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      <strong>{log.action}</strong>
                      {log.target_type && ` - ${log.target_type}`}
                    </Typography>

                    {log.description && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {log.description}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(
                        new Date(log.created_at.replace(" ", "T")),
                        {
                          addSuffix: true,
                          locale: vi,
                        }
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ActivityLogsList;
