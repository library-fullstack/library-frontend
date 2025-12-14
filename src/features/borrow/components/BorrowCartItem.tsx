import React, { memo, useCallback, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../types/borrow.types";

interface BorrowCartItemProps {
  item: CartItem;
  onUpdateQuantity: (bookId: number, quantity: number) => Promise<void>;
  onRemove: (bookId: number) => Promise<void>;
  isUpdating?: boolean;
}

const BorrowCartItem = memo(function BorrowCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: BorrowCartItemProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const maxAvailable = item.available_count || 0;
  const [localIsUpdating, setLocalIsUpdating] = useState(false);
  const [warning, setWarning] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  const handleButtonClick = useCallback(
    (newQuantity: number, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const isIncreasing = newQuantity > item.quantity;

      if (isIncreasing && newQuantity > maxAvailable) {
        setWarning({
          open: true,
          message: `Chỉ có thể mượn tối đa ${maxAvailable} quyển sách này`,
        });
        return;
      }

      if (newQuantity !== item.quantity && newQuantity >= 0) {
        if (newQuantity === 0) {
          onRemove(item.bookId);
        } else {
          setLocalIsUpdating(true);
          onUpdateQuantity(item.bookId, newQuantity).finally(() =>
            setLocalIsUpdating(false)
          );
        }
      }
    },
    [item.bookId, item.quantity, maxAvailable, onUpdateQuantity, onRemove]
  );

  return (
    <>
      <Card
        onClick={() => navigate(`/books/${item.bookId}`)}
        sx={{
          mb: 2,
          border: `1px solid`,
          borderColor: "divider",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 6px 20px rgba(129,140,248,0.2)"
                : "0 6px 20px rgba(99,102,241,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            {item.thumbnail_url && (
              <Box
                component="img"
                src={item.thumbnail_url}
                alt={item.title}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/books/${item.bookId}`);
                }}
                sx={{
                  width: { xs: 70, sm: 80 },
                  height: { xs: 100, sm: 120 },
                  objectFit: "cover",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  flexShrink: 0,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            )}

            <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/books/${item.bookId}`);
                }}
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  cursor: "pointer",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                {item.author_names || "Đang cập nhật"}
              </Typography>

              {maxAvailable === 0 && (
                <Alert
                  severity="error"
                  sx={{
                    py: 0.5,
                    px: 1,
                    fontSize: "0.75rem",
                    "& .MuiAlert-icon": { fontSize: "1rem" },
                  }}
                >
                  Sách đã hết. Vui lòng giảm hoặc xoá sách khỏi giỏ!
                </Alert>
              )}
              {maxAvailable > 0 && item.quantity > maxAvailable && (
                <Alert
                  severity="warning"
                  sx={{
                    py: 0.5,
                    px: 1,
                    fontSize: "0.75rem",
                    "& .MuiAlert-icon": { fontSize: "1rem" },
                  }}
                >
                  Chỉ còn <strong>{maxAvailable}</strong> quyển có sẵn. Bạn đang
                  mượn <strong>{item.quantity}</strong> quyển. Vui lòng giảm số
                  lượng!
                </Alert>
              )}

              {isMobile && (
                <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(item.quantity - 1, e)}
                      disabled={isUpdating || localIsUpdating}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Minus size={18} />
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 40,
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleButtonClick(item.quantity + 1, e)}
                      disabled={isUpdating || localIsUpdating}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Plus size={18} />
                    </IconButton>
                  </Stack>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.bookId);
                    }}
                    disabled={isUpdating || localIsUpdating}
                    sx={{
                      color: "error.main",
                      "&:hover": { bgcolor: "error.lighter" },
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Stack>
              )}
            </Stack>

            {!isMobile && (
              <Stack direction="column" spacing={1} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleButtonClick(item.quantity - 1, e)}
                    disabled={isUpdating || localIsUpdating}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Minus size={18} />
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 40,
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleButtonClick(item.quantity + 1, e)}
                    disabled={isUpdating || localIsUpdating}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Plus size={18} />
                  </IconButton>
                </Stack>

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.bookId);
                  }}
                  disabled={isUpdating || localIsUpdating}
                  sx={{
                    color: "error.main",
                    "&:hover": { bgcolor: "error.lighter" },
                  }}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Snackbar
        open={warning.open}
        autoHideDuration={3000}
        onClose={() => setWarning({ ...warning, open: false })}
        anchorOrigin={
          isMobile
            ? { vertical: "top", horizontal: "center" }
            : { vertical: "top", horizontal: "right" }
        }
        sx={isMobile ? { top: "60px !important" } : { top: "140px !important" }}
      >
        <Alert
          onClose={() => setWarning({ ...warning, open: false })}
          severity="warning"
          variant="filled"
        >
          {warning.message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default BorrowCartItem;
