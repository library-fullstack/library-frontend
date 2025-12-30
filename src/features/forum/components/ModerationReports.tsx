import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { forumModerationApi } from "../api/forum.api";
import type {
  ForumReport,
  ApiResponse,
  PaginationMeta,
} from "../types/forum.types";

interface ReportsListProps {
  onReportUpdated?: () => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ onReportUpdated }) => {
  const [reports, setReports] = useState<ForumReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"OPEN" | "REVIEWING" | "RESOLVED">(
    "OPEN"
  );
  const [resolvingReport, setResolvingReport] = useState<number | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const limit = 20;

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const axiosResponse = await forumModerationApi.getReports(
        status,
        page,
        limit
      );
      const response = axiosResponse.data as ApiResponse<ForumReport[]> & {
        pagination: PaginationMeta;
      };
      setReports(response.data || []);
      setTotal(response.pagination?.total || 0);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách báo cáo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (
    reportId: number,
    action: "approve" | "dismiss"
  ) => {
    try {
      await forumModerationApi.resolveReport(reportId, action, resolutionNote);
      setReports(reports.filter((r) => r.id !== reportId));
      setResolvingReport(null);
      setResolutionNote("");
      onReportUpdated?.();
    } catch (err) {
      console.error("Error resolving report:", err);
      alert("Lỗi khi xử lý báo cáo");
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
      <Stack direction="row" spacing={1} mb={2}>
        {(["OPEN", "REVIEWING", "RESOLVED"] as const).map((s) => (
          <Button
            key={s}
            variant={status === s ? "contained" : "outlined"}
            size="small"
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
          >
            {s === "OPEN"
              ? "Mở"
              : s === "REVIEWING"
              ? "Đang kiểm tra"
              : "Đã xử lý"}
          </Button>
        ))}
      </Stack>

      {reports.length === 0 ? (
        <Alert severity="info">Không có báo cáo nào ở trạng thái này</Alert>
      ) : (
        <>
          {reports.map((report) => (
            <Card
              key={report.id}
              sx={{ mb: 1.5, "&:not(:last-child)": { mb: 1.5 } }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="h6">
                    {report.target_type === "POST"
                      ? "Báo cáo bài viết"
                      : "Báo cáo bình luận"}
                  </Typography>
                  <Chip label={report.reason} size="small" />
                </Stack>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Từ: {String(report.reporter_name || "Không rõ")}
                </Typography>

                {report.target_type === "POST" && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Bài viết:</strong>{" "}
                    {String(report.post_title || "Không rõ")}
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Chi tiết:</strong>{" "}
                  {String(
                    (report as { description?: string }).description ||
                      "Không có"
                  )}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => setResolvingReport(report.id)}
                  >
                    Xác nhận vi phạm
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => handleResolve(report.id, "dismiss")}
                  >
                    Bỏ qua
                  </Button>
                </Stack>
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

      <Dialog
        open={resolvingReport !== null}
        onClose={() => setResolvingReport(null)}
      >
        <DialogTitle>Xác nhận vi phạm</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ghi chú xử lý"
            fullWidth
            multiline
            rows={3}
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="Nhập ghi chú về xử lý (tùy chọn)..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolvingReport(null)}>Hủy</Button>
          <Button
            onClick={() => handleResolve(resolvingReport!, "approve")}
            color="error"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsList;
