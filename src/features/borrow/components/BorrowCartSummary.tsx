import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import type { BorrowCart } from "../types/borrow.types";

interface BorrowCartSummaryProps {
  cart: BorrowCart;
  onProceed: () => void;
  loading?: boolean;
  hasOutOfStock?: boolean;
}

const BorrowCartSummary = memo(function BorrowCartSummary({
  cart,
  onProceed,
  loading = false,
  hasOutOfStock = false,
}: BorrowCartSummaryProps) {
  return (
    <Card
      sx={{
        position: "sticky",
        top: 80,
        border: `1px solid`,
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
        >
          Tổng hợp
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Số đầu sách:</Typography>
            <Typography fontWeight={600}>{cart.totalBooks}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Tổng bản mượn:</Typography>
            <Typography fontWeight={600}>{cart.totalCopies}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onProceed}
          disabled={cart.items.length === 0 || loading || hasOutOfStock}
          sx={{
            fontWeight: 600,
            textTransform: "none",
            py: 1.2,
          }}
        >
          {loading
            ? "Đang xử lý..."
            : hasOutOfStock
            ? "Vui lòng cập nhật giỏ"
            : "Tiến hành mượn"}
        </Button>
      </CardContent>
    </Card>
  );
});

export default BorrowCartSummary;
