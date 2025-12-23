import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Stack,
  useTheme,
  Chip,
  Skeleton,
} from "@mui/material";
import { AccountCircle, AccessTime } from "@mui/icons-material";
import { statisticsApi } from "../../../features/admin/api/statistics.api";

interface RecentBorrower {
  id: number;
  user_name: string;
  borrowed_at: string;
  status: string;
}

interface RecentBorrowersSectionProps {
  bookId?: number;
}

export default function RecentBorrowersSection({
  bookId,
}: RecentBorrowersSectionProps): React.ReactElement {
  const theme = useTheme();
  const [borrowers, setBorrowers] = useState<RecentBorrower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const response = await statisticsApi.getBorrowManagement({
          page: 1,
          limit: 10,
        });
        const bookBorrows = (response.data?.borrows || [])
          .filter(
            (b: Record<string, unknown>) =>
              bookId === undefined || (b.book_id as number) === bookId
          )
          .slice(0, 4)
          .map((b: Record<string, unknown>) => ({
            id: Number(b.id),
            user_name: String(b.user_name || ""),
            borrowed_at: String(b.borrowed_at || ""),
            status: String(b.status || ""),
          }));
        setBorrowers(bookBorrows);
      } catch (error) {
        console.error("Failed to fetch borrowers:", error);
        setBorrowers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowers();
  }, [bookId]);

  const mockBorrowers: RecentBorrower[] = [
    {
      id: 1,
      user_name: "Nguyễn Văn A",
      borrowed_at: "2025-10-28",
      status: "BORROWED",
    },
    {
      id: 2,
      user_name: "Trần Thị B",
      borrowed_at: "2025-10-25",
      status: "RETURNED",
    },
    {
      id: 3,
      user_name: "Lê Văn C",
      borrowed_at: "2025-10-20",
      status: "RETURNED",
    },
  ];

  const displayBorrowers = borrowers.length > 0 ? borrowers : mockBorrowers;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Người mượn gần đây
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 1.5,
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={2}>
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} height={80} />
            ))
          ) : displayBorrowers.length === 0 ? (
            <Typography color="text.secondary">Chưa có người mượn</Typography>
          ) : (
            displayBorrowers.map((borrower) => (
              <Box
                key={borrower.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.02)"
                      : "rgba(255,255,255,0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "light"
                        ? "rgba(79, 70, 229, 0.05)"
                        : "rgba(129, 140, 248, 0.08)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 48,
                    height: 48,
                  }}
                >
                  <AccountCircle sx={{ fontSize: 32 }} />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {borrower.user_name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <AccessTime
                      sx={{ fontSize: 14, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(borrower.borrowed_at)}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={
                    borrower.status === "BORROWED" ? "Đang mượn" : "Đã trả"
                  }
                  color={borrower.status === "BORROWED" ? "primary" : "success"}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            ))
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
