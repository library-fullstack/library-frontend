import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
  Snackbar,
} from "@mui/material";
import { BookOpen, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../shared/api/axiosClient";
import { borrowApi } from "../../features/borrow/api/borrow.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { parseApiError } from "../../shared/lib/errorHandler";

interface BorrowItem {
  id: number;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  signature?: string;
  renewal_count?: number;
  last_renewal_date?: string;
  items?: Array<{
    book_title: string;
    thumbnail_url?: string;
  }>;
}

const statusConfig = {
  PENDING: { label: "Chờ xác nhận", color: "warning" as const, icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", color: "info" as const, icon: Clock },
  APPROVED: { label: "Đã duyệt", color: "primary" as const, icon: BookOpen },
  ACTIVE: { label: "Đang mượn", color: "secondary" as const, icon: BookOpen },
  RETURNED: { label: "Đã trả", color: "success" as const, icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "error" as const, icon: XCircle },
  OVERDUE: { label: "Quá hạn", color: "error" as const, icon: XCircle },
};

export default function MyBorrows(): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [renewingId, setRenewingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const statusFilter =
    activeTab === 0
      ? undefined
      : activeTab === 1
      ? "ACTIVE"
      : activeTab === 2
      ? "RETURNED"
      : "CANCELLED";

  const { data, isLoading, error } = useQuery({
    queryKey: ["myBorrows", statusFilter],
    queryFn: async () => {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await axiosClient.get("/borrows/my", { params });
      return response.data as { success: boolean; data: BorrowItem[] };
    },
  });

  const handleCancel = async (borrowId: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn hủy phiếu mượn này không?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(borrowId);
      await borrowApi.cancelBorrow(borrowId);

      setSnackbar({
        open: true,
        message: "Hủy phiếu mượn thành công",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["myBorrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrowStats"] });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Không thể hủy phiếu mượn",
        type: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleRenew = async (borrowId: number) => {
    try {
      setRenewingId(borrowId);
      const result = (await borrowApi.renewBorrow(borrowId)) as {
        success: boolean;
        message: string;
        data?: {
          borrow_id: number;
          old_due_date: string;
          new_due_date: string;
          renewal_count: number;
        };
      };

      if (result.success && result.data) {
        setSnackbar({
          open: true,
          message: `Gia hạn thành công! Hạn mới: ${format(
            new Date(result.data.new_due_date),
            "dd/MM/yyyy",
            { locale: vi }
          )}`,
          type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["myBorrows"] });
        queryClient.invalidateQueries({ queryKey: ["borrowStats"] });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Không thể gia hạn phiếu mượn",
        type: "error",
      });
    } finally {
      setRenewingId(null);
    }
  };

  const borrows = data?.data || [];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Lịch sử mượn sách
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi tất cả phiếu mượn sách của bạn
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
        >
          <Tab label="Tất cả" />
          <Tab label="Đang mượn" />
          <Tab label="Đã trả" />
          <Tab label="Đã hủy" />
        </Tabs>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{parseApiError(error)}</Alert>
      ) : borrows.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <BookOpen
            size={64}
            color={theme.palette.text.secondary}
            style={{ marginBottom: 16 }}
          />
          <Typography variant="h6" gutterBottom>
            Chưa có phiếu mượn nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy bắt đầu khám phá và mượn sách yêu thích của bạn
          </Typography>
          <Button variant="contained" href="/catalog">
            Khám phá sách
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {borrows.map((borrow) => {
            const statusInfo =
              statusConfig[borrow.status as keyof typeof statusConfig];
            const Icon = statusInfo?.icon || BookOpen;

            return (
              <Card key={borrow.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                          Phiếu mượn #{String(borrow.id).padStart(6, "0")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ngày mượn:{" "}
                          {format(
                            new Date(borrow.borrow_date),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<Icon size={16} />}
                        label={statusInfo?.label || borrow.status}
                        color={statusInfo?.color || "default"}
                        size="small"
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Hạn trả
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {format(new Date(borrow.due_date), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </Typography>
                      </Box>
                      {borrow.return_date && (
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Ngày trả
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {format(
                              new Date(borrow.return_date),
                              "dd/MM/yyyy",
                              { locale: vi }
                            )}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Số lượng sách
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {borrow.items?.length || 0} quyển
                        </Typography>
                      </Box>
                    </Stack>

                    {borrow.items && borrow.items.length > 0 && (
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          gutterBottom
                        >
                          Danh sách sách
                        </Typography>
                        <Stack spacing={1}>
                          {borrow.items.map((item, idx) => (
                            <Stack
                              key={idx}
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              {item.thumbnail_url && (
                                <Box
                                  component="img"
                                  src={item.thumbnail_url}
                                  alt={item.book_title}
                                  sx={{
                                    width: 40,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 0.5,
                                  }}
                                />
                              )}
                              <Typography variant="body2">
                                {idx + 1}. {item.book_title}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {borrow.status === "PENDING" && (
                      <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                        <Alert
                          severity="warning"
                          sx={{
                            mb: { xs: 1.5, sm: 2 },
                            py: { xs: 0.5, sm: 1 },
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            "& .MuiAlert-icon": {
                              fontSize: { xs: 18, sm: 22 },
                            },
                          }}
                        >
                          Phiếu mượn chưa được xác nhận. Vui lòng ký xác nhận để
                          hoàn tất.
                        </Alert>
                        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            href={`/borrow/confirm/${borrow.id}`}
                            sx={{
                              py: { xs: 1, sm: 1.2 },
                              fontSize: { xs: "0.8rem", sm: "0.875rem" },
                              fontWeight: 600,
                              textTransform: "none",
                            }}
                          >
                            Xác nhận ngay
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            disabled={cancellingId === borrow.id}
                            onClick={() => handleCancel(borrow.id)}
                            sx={{
                              py: { xs: 1, sm: 1.2 },
                              px: { xs: 2, sm: 3 },
                              fontSize: { xs: "0.8rem", sm: "0.875rem" },
                              fontWeight: 600,
                              textTransform: "none",
                              minWidth: { xs: 70, sm: 90 },
                            }}
                          >
                            {cancellingId === borrow.id ? "..." : "Hủy"}
                          </Button>
                        </Stack>
                      </Box>
                    )}

                    {borrow.status === "ACTIVE" && (
                      <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                        {(borrow.renewal_count || 0) < 1 &&
                          new Date() < new Date(borrow.due_date) &&
                          (() => {
                            const daysUntilDue = Math.ceil(
                              (new Date(borrow.due_date).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            );
                            return daysUntilDue >= 3;
                          })() && (
                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              disabled={renewingId === borrow.id}
                              startIcon={
                                renewingId === borrow.id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <RefreshCw size={16} />
                                )
                              }
                              onClick={() => handleRenew(borrow.id)}
                              sx={{
                                py: { xs: 1, sm: 1.2 },
                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                fontWeight: 600,
                                textTransform: "none",
                              }}
                            >
                              {renewingId === borrow.id
                                ? "Đang gia hạn..."
                                : "Gia hạn thêm 7 ngày"}
                            </Button>
                          )}

                        {(borrow.renewal_count || 0) >= 1 && (
                          <Alert
                            severity="info"
                            icon={<RefreshCw size={18} />}
                            sx={{
                              py: { xs: 0.5, sm: 1 },
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              "& .MuiAlert-icon": {
                                fontSize: { xs: 18, sm: 22 },
                              },
                            }}
                          >
                            Đã gia hạn 1 lần
                            {borrow.last_renewal_date &&
                              ` vào ${format(
                                new Date(borrow.last_renewal_date),
                                "dd/MM/yyyy",
                                { locale: vi }
                              )}`}
                            . Vui lòng trả sách đúng hạn.
                          </Alert>
                        )}

                        {new Date() >= new Date(borrow.due_date) && (
                          <Alert
                            severity="error"
                            sx={{
                              py: { xs: 0.5, sm: 1 },
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              "& .MuiAlert-icon": {
                                fontSize: { xs: 18, sm: 22 },
                              },
                            }}
                          >
                            Phiếu đã quá hạn. Không thể gia hạn. Vui lòng trả
                            sách ngay.
                          </Alert>
                        )}
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
