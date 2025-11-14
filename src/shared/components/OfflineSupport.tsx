import { useState, useCallback } from "react";
import { useServiceWorker } from "../hooks/useServiceWorker";
import { Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import logger from "../lib/logger";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "warning" | "info" | "error";
}

export default function OfflineSupport() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSyncComplete = useCallback(
    (result: { succeeded: number; failed: number }) => {
      logger.info("[Offline] Sync complete:", result);

      if (result.succeeded > 0) {
        setSnackbar({
          open: true,
          message: `${result.succeeded} hành động đã được lưu lên máy chủ`,
          severity: "success",
        });
      }

      if (result.failed > 0) {
        setSnackbar({
          open: true,
          message: `${result.failed} hành động chưa được lưu. Hãy thử lại khi kết nối bị khôi phục`,
          severity: "warning",
        });
      }
    },
    []
  );

  const { isOnline } = useServiceWorker({
    enabled: true,
    onSyncComplete: handleSyncComplete,
  });

  const handleOnlineStatusChange = () => {
    if (!isOnline) {
      logger.warn("[Offline] No network connection");
      setSnackbar({
        open: true,
        message: "Bạn đang ngoại tuyến. Các hành động sẽ được lưu.",
        severity: "info",
      });
    } else {
      logger.info("[Offline] Connected to network");
    }
  };

  if (!isOnline && snackbar.severity !== "info") {
    handleOnlineStatusChange();
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={snackbar.severity === "warning" ? 5000 : 3000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{
        vertical: "top",
        horizontal: isMobile ? "center" : "right",
      }}
      sx={{ top: { xs: "60px", sm: "140px" }, zIndex: 9999 }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
