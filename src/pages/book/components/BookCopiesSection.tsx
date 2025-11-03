import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
} from "@mui/material";
import { Inventory2 } from "@mui/icons-material";
import type { BookCopy, CopyCondition, CopyStatus } from "../../../features/books/types";

interface BookCopiesSectionProps {
  copies: BookCopy[];
}

export default function BookCopiesSection({
  copies,
}: BookCopiesSectionProps): React.ReactElement | null {
  const theme = useTheme();

  if (!copies || copies.length === 0) {
    return null;
  }

  const getConditionLabel = (condition: CopyCondition): string => {
    switch (condition) {
      case "NEW":
        return "Mới";
      case "GOOD":
        return "Tốt";
      case "WORN":
        return "Cũ";
      case "DAMAGED":
        return "Hư hỏng";
      case "LOST":
        return "Mất";
      default:
        return condition;
    }
  };

  const getConditionColor = (
    condition: CopyCondition
  ): "success" | "info" | "warning" | "error" | "default" => {
    switch (condition) {
      case "NEW":
        return "success";
      case "GOOD":
        return "info";
      case "WORN":
        return "warning";
      case "DAMAGED":
      case "LOST":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: CopyStatus): string => {
    switch (status) {
      case "AVAILABLE":
        return "Có sẵn";
      case "ON_LOAN":
        return "Đang mượn";
      case "RESERVED":
        return "Đã đặt";
      case "LOST":
        return "Mất";
      case "REMOVED":
        return "Đã loại";
      default:
        return status;
    }
  };

  const getStatusColor = (
    status: CopyStatus
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "AVAILABLE":
        return "success";
      case "ON_LOAN":
      case "RESERVED":
        return "warning";
      case "LOST":
      case "REMOVED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Inventory2 sx={{ color: "primary.main" }} />
          Danh sách bản sao ({copies.length})
        </Box>
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 1.5,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor:
                  theme.palette.mode === "light"
                    ? "rgba(79, 70, 229, 0.05)"
                    : "rgba(129, 140, 248, 0.08)",
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>Mã vạch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Vị trí kệ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tình trạng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {copies.map((copy) => (
              <TableRow
                key={copy.id}
                sx={{
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "light"
                        ? "rgba(0,0,0,0.02)"
                        : "rgba(255,255,255,0.02)",
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                    {copy.barcode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {copy.shelf_code || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getConditionLabel(copy.condition_enum)}
                    color={getConditionColor(copy.condition_enum)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(copy.status)}
                    color={getStatusColor(copy.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {copy.note || "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
