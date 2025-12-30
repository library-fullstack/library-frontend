import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Skeleton,
  Divider,
} from "@mui/material";
import { Clock, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

type BorrowStatus =
  | "PENDING"
  | "CONFIRMED"
  | "APPROVED"
  | "ACTIVE"
  | "OVERDUE"
  | "RETURNED"
  | "CANCELLED";

interface Activity {
  id: number;
  book_title: string;
  user_name: string;
  borrowed_at: string;
  due_date: string;
  status: BorrowStatus;
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const getStatusColor = (
  status: string
): "primary" | "success" | "error" | "default" => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "primary";
    case "RETURNED":
      return "success";
    case "OVERDUE":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "Đang mượn";
    case "RETURNED":
      return "Đã trả";
    case "OVERDUE":
      return "Quá hạn";
    default:
      return status;
  }
};

export default function RecentActivity({
  activities,
  loading = false,
}: RecentActivityProps) {
  if (loading) {
    return (
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Hoạt động gần đây
          </Typography>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="80%" height={24} />
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="40%" height={20} />
                </Box>
              </Box>
              {i < 5 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Hoạt động gần đây
          </Typography>
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <BookOpen size={48} style={{ opacity: 0.3 }} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Chưa có hoạt động nào
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Hoạt động gần đây
        </Typography>
        {activities.map((activity, index) => (
          <Box key={activity.id}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "primary.main",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {activity.user_name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.5,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activity.user_name}
                  </Typography>
                  <Chip
                    label={getStatusLabel(activity.status)}
                    size="small"
                    color={getStatusColor(activity.status)}
                    sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600 }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <BookOpen
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 4 }}
                  />
                  {activity.book_title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <Clock
                    size={12}
                    style={{ verticalAlign: "middle", marginRight: 4 }}
                  />
                  {formatDistanceToNow(new Date(activity.borrowed_at), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </Typography>
              </Box>
            </Box>
            {index < activities.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
