import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Snackbar,
  Alert,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../shared/types/api-error";
import type { LocationState } from "../../shared/types/router";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
  useClearCart,
} from "../../features/borrow/hooks/useCart";
import BorrowCartItem from "../../features/borrow/components/BorrowCartItem";
import BorrowCartSummary from "../../features/borrow/components/BorrowCartSummary";
import { borrowApi } from "../../features/borrow/api/borrow.api";
import logger from "../../shared/lib/logger";

export default function Cart(): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: cart, isLoading: loading } = useCart();
  const { mutateAsync: removeItem } = useRemoveFromCart();
  const { mutateAsync: updateQuantity } = useUpdateCartQuantity();
  const { mutateAsync: clearCart } = useClearCart();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Set<number>>(new Set());
  const [hasOutOfStock, setHasOutOfStock] = useState(false);

  React.useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.loginSuccess) {
      setSnackbar({
        open: true,
        message: "Đăng nhập thành công!",
        severity: "success",
      });
      navigate(location.pathname, {
        replace: true,
        state: state ? { ...state, loginSuccess: undefined } : {},
      });
    }
  }, [location.pathname, navigate, location.state]);

  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
  }, [queryClient]);

  React.useEffect(() => {
    if (!cart || cart.items.length === 0) {
      setHasOutOfStock(false);
      return;
    }

    const outOfStockItems = cart.items.filter(
      (item) => item.quantity > item.available_count!
    );

    setHasOutOfStock(outOfStockItems.length > 0);
  }, [cart]);

  const handleUpdateQuantity = async (bookId: number, quantity: number) => {
    setPendingUpdates((prev) => new Set(prev).add(bookId));
    try {
      await updateQuantity({ bookId, quantity });
    } catch (error) {
      logger.error("[Cart] Error updating quantity:", error);
      const err = error as ApiError;
      const message =
        err?.response?.data?.message || "Không thể cập nhật số lượng";
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (bookId: number) => {
    setPendingUpdates((prev) => new Set(prev).add(bookId));
    try {
      await removeItem(bookId);
    } finally {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  };

  const handleProceed = async () => {
    if (!cart || cart.items.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await borrowApi.createBorrow({
        items: cart.items.map((item) => ({
          book_id: item.bookId,
          quantity: item.quantity,
        })),
      });

      if (response.success) {
        clearCart();
        setSnackbar({
          open: true,
          message: "Tạo yêu cầu mượn thành công!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/borrow");
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Có lỗi xảy ra",
          severity: "error",
        });
      }
    } catch (error) {
      logger.error("[BorrowCart] Error creating borrow:", error);
      const err = error as ApiError;

      if (err?.response?.data?.code === "INSUFFICIENT_STOCK") {
        const errorData = err.response.data.errors;
        let message = "Một số sách không đủ số lượng:\n\n";

        if (Array.isArray(errorData) && errorData.length > 0) {
          message = errorData.map((e) => e.message).join("\n");
        }

        setSnackbar({
          open: true,
          message,
          severity: "error",
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        const message =
          err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
        setSnackbar({
          open: true,
          message,
          severity: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAll = () => {
    if (confirm("Bạn có chắc muốn xóa tất cả sách khỏi giỏ?")) {
      clearCart();
      setSnackbar({
        open: true,
        message: "Đã xóa tất cả sách khỏi giỏ",
        severity: "info",
      });
    }
  };

  if (!cart || cart.items.length === 0) {
    if (loading) {
      return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
          >
            Giỏ mượn sách
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={2}>
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: 2,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ width: 80, height: 120, flexShrink: 0 }}>
                      <Skeleton variant="rectangular" width={80} height={120} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="60%" height={24} />
                      <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
                      <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ width: { xs: "100%", md: 380 }, flexShrink: 0 }}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Skeleton width="100%" height={30} />
                <Skeleton width="100%" height={20} sx={{ mt: 1 }} />
                <Skeleton width="100%" height={20} sx={{ mt: 1 }} />
                <Skeleton width="100%" height={40} sx={{ mt: 2 }} />
              </Box>
            </Box>
          </Stack>
        </Container>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 200px)",
          width: "100%",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Giỏ mượn của bạn trống
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Hãy thêm sách để bắt đầu mượn
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/catalog")}
              sx={{ fontWeight: 600, textTransform: "none" }}
            >
              Khám phá sách
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
      >
        Giỏ mượn sách
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          {cart.items.length > 0 && (
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary">
                  {cart.totalBooks} đầu sách
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={handleClearAll}
                  sx={{ textTransform: "none" }}
                >
                  Xóa tất cả
                </Button>
              </Stack>
            </Stack>
          )}

          {cart.items.map((item) => (
            <BorrowCartItem
              key={item.bookId}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              isUpdating={pendingUpdates.has(item.bookId)}
            />
          ))}
        </Box>

        <Box sx={{ width: { xs: "100%", md: 380 }, flexShrink: 0 }}>
          <BorrowCartSummary
            cart={cart}
            onProceed={handleProceed}
            loading={isSubmitting}
            hasOutOfStock={hasOutOfStock}
          />
        </Box>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "right",
        }}
        sx={{ top: { xs: "60px", sm: "140px" }, zIndex: 9999 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
