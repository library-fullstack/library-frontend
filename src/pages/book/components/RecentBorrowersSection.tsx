import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Stack,
  useTheme,
  Chip,
} from "@mui/material";
import { AccountCircle, AccessTime } from "@mui/icons-material";

interface RecentBorrower {
  id: number;
  name: string;
  avatar?: string;
  borrowDate: string;
  status: "BORROWED" | "RETURNED";
}

interface RecentBorrowersSectionProps {
  bookTitle: string;
}

export default function RecentBorrowersSection({
  bookTitle,
}: RecentBorrowersSectionProps): React.ReactElement {
  const theme = useTheme();

  const mockBorrowers: RecentBorrower[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      borrowDate: "2025-10-28",
      status: "BORROWED",
    },
    {
      id: 2,
      name: "Trần Thị B",
      borrowDate: "2025-10-25",
      status: "RETURNED",
    },
    {
      id: 3,
      name: "Lê Văn C",
      borrowDate: "2025-10-20",
      status: "RETURNED",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      borrowDate: "2025-10-15",
      status: "RETURNED",
    },
  ];

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
          {mockBorrowers.map((borrower, index) => (
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
                  {borrower.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(borrower.borrowDate)}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={borrower.status === "BORROWED" ? "Đang mượn" : "Đã trả"}
                color={borrower.status === "BORROWED" ? "primary" : "success"}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
