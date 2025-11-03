import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import {
  BookPlus,
  UserPlus,
  Settings,
  BarChart3,
  FileText,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionButton {
  icon: React.ReactElement;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}

export default function QuickActions() {
  const navigate = useNavigate();

  const actions: ActionButton[] = [
    {
      icon: <BookPlus size={20} />,
      label: "Thêm sách mới",
      description: "Thêm sách vào thư viện",
      color: "#4F46E5",
      onClick: () => navigate("/admin/books/new"),
    },
    {
      icon: <UserPlus size={20} />,
      label: "Thêm người dùng",
      description: "Tạo tài khoản mới",
      color: "#10B981",
      onClick: () => navigate("/admin/users/new"),
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Xem thống kê",
      description: "Báo cáo chi tiết",
      color: "#F59E0B",
      onClick: () => navigate("/admin/analytics"),
    },
    {
      icon: <FileText size={20} />,
      label: "Quản lý mượn trả",
      description: "Xử lý yêu cầu",
      color: "#3B82F6",
      onClick: () => navigate("/admin/borrows"),
    },
    {
      icon: <Shield size={20} />,
      label: "Phân quyền",
      description: "Quản lý vai trò",
      color: "#8B5CF6",
      onClick: () => navigate("/admin/permissions"),
    },
    {
      icon: <Settings size={20} />,
      label: "Cài đặt hệ thống",
      description: "Cấu hình chung",
      color: "#6B7280",
      onClick: () => navigate("/admin/settings"),
    },
  ];

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Thao tác nhanh
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              sx={{
                p: 2,
                height: "auto",
                justifyContent: "flex-start",
                textAlign: "left",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: action.color,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? `${action.color}20`
                      : `${action.color}15`,
                  color: action.color,
                  mr: 1.5,
                  flexShrink: 0,
                }}
              >
                {action.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    color: "text.primary",
                    mb: 0.25,
                  }}
                >
                  {action.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                  }}
                >
                  {action.description}
                </Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
