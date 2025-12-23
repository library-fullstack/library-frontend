import React from "react";
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  Close,
  CheckCircle,
  Error,
  Info,
  Favorite,
  LibraryBooks,
  Forum,
  Delete,
} from "@mui/icons-material";
import { useNotifications } from "../../shared/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { Notification } from "../../shared/api/notifications.api";

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const getIcon = (notification: Notification) => {
    const { ntype, payload } = notification;

    if (ntype === "SYSTEM" && payload.type?.includes("BORROW")) {
      return <LibraryBooks fontSize="small" />;
    } else if (ntype === "BORROW") {
      return <LibraryBooks fontSize="small" />;
    } else if (ntype === "MODERATION") {
      if (payload.type === "POST_APPROVED") {
        return <CheckCircle fontSize="small" color="success" />;
      } else if (payload.type === "POST_REJECTED") {
        return <Error fontSize="small" color="error" />;
      }
      return <Forum fontSize="small" />;
    } else if (ntype === "REPLY") {
      return <Forum fontSize="small" />;
    } else if (ntype === "FAVOURITE") {
      return <Favorite fontSize="small" color="error" />;
    }
    return <Info fontSize="small" />;
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }

    if (notification.payload.type?.includes("BORROW")) {
      navigate("/user/profile?tab=borrows");
      onClose();
      return;
    }

    if (notification.payload.link) {
      navigate(notification.payload.link as string);
      onClose();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <Paper
      sx={{
        width: 400,
        maxWidth: "90vw",
        maxHeight: 600,
        display: "flex",
        flexDirection: "column",
      }}
      elevation={8}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Thông báo
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {notifications.some((n) => !n.read_at) && (
            <Button size="small" onClick={markAllAsRead}>
              Đánh dấu đã đọc
            </Button>
          )}
          <IconButton size="small" onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Không có thông báo
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {notifications.map((notification: Notification, index: number) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => handleDelete(e, notification.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      bgcolor: notification.read_at
                        ? "transparent"
                        : "action.hover",
                      "&:hover": {
                        bgcolor: notification.read_at
                          ? "action.hover"
                          : "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "primary.main",
                        }}
                      >
                        {getIcon(notification)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={notification.read_at ? 400 : 600}
                        >
                          {notification.payload.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {notification.payload.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true, locale: vi }
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}
