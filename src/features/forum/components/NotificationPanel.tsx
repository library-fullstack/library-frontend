import {
  Box,
  Avatar,
  Typography,
  Stack,
  Drawer,
  Divider,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { X as CloseIcon } from "lucide-react";
import {
  useUnreadNotifications,
  useMarkNotificationAsRead,
} from "../hooks/useForum";
import { UserNotification } from "../types/forum.types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ open, onClose }: Props) => {
  const theme = useTheme();
  const { data: notificationsData, isLoading } = useUnreadNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = notificationsData?.data || [];

  const handleNotificationClick = (notificationId: number) => {
    markAsRead(notificationId);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Thông báo
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon size={20} />
          </IconButton>
        </Box>

        <Divider />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: theme.palette.action.hover,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.divider,
              borderRadius: "3px",
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography color="textSecondary">Đang tải...</Typography>
            </Box>
          ) : notifications.length > 0 ? (
            <Stack spacing={0}>
              {notifications.map((notification: UserNotification) => (
                <Box
                  key={notification.id}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    backgroundColor: !notification.read_at
                      ? theme.palette.action.hover
                      : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      {notification.ntype[0]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {notification.ntype === "REPLY" && "Phản hồi mới"}
                        {notification.ntype === "MENTION" && "Được nhắc đến"}
                        {notification.ntype === "MODERATION" &&
                          "Thông báo kiểm duyệt"}
                        {notification.ntype === "SYSTEM" &&
                          "Thông báo hệ thống"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {notification.created_at
                          ? formatDistanceToNow(
                              new Date(notification.created_at),
                              {
                                locale: vi,
                                addSuffix: true,
                              }
                            )
                          : "vừa xong"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography color="textSecondary">
                Không có thông báo nào
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationPanel;
