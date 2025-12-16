import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import { forumModerationApi } from "../api/forum.api";
import type { ApiResponse, PaginationMeta } from "../types/forum.types";

interface ActivityLog {
  id: string;
  user_id: string;
  full_name: string;
  type: string;
  action: string;
  description: string;
  created_at: string;
}

interface ActivityLogsProps {
  onLogsUpdated?: () => void;
}

const ActivityLogsList: React.FC<ActivityLogsProps> = ({
  onLogsUpdated: _onLogsUpdated,
}) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 50;

  useEffect(() => {
    fetchActivityLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const axiosResponse = await forumModerationApi.getActivityLogs(
        "FORUM",
        page,
        limit
      );
      const response = axiosResponse.data as ApiResponse<any[]> & {
        pagination: PaginationMeta;
      };
      setLogs(response.data || []);
      setTotal(response.pagination?.total || 0);
      setError(null);
    } catch (err) {
      setError("Không thể tải nhật ký hoạt động");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const getActionColor = (action: string) => {
    if (action.includes("APPROVE")) return "success";
    if (action.includes("REJECT")) return "error";
    if (action.includes("BAN")) return "error";
    return "default";
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
      {logs.length === 0 ? (
        <Alert severity="info">Không có hoạt động nào được ghi lại</Alert>
      ) : (
        <>
          {logs.map((log) => (
            <Card key={log.id} sx={{ mb: 2 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="start"
                  mb={1}
                >
                  <Typography variant="h6">
                    {log.full_name || "Hệ thống"}
                  </Typography>
                  <Chip
                    label={log.action}
                    size="small"
                    color={
                      getActionColor(log.action) as
                        | "success"
                        | "error"
                        | "default"
                    }
                  />
                </Stack>

                {log.description && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {log.description}
                  </Typography>
                )}

                <Typography variant="caption" color="textSecondary">
                  {formatDate(log.created_at)}
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
            <Button
              disabled={page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              Trang trước
            </Button>
            <Typography>
              Trang {page} / {Math.ceil(total / limit)}
            </Typography>
            <Button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage(page + 1)}
            >
              Trang sau
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ActivityLogsList;
