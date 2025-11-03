import * as React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home } from "@mui/icons-material";
import { AnimatePresence } from "framer-motion";
import DisintegrationTransition from "../../shared/ui/DisintegrationTransition";
import { AuthSnackbarContext } from "./AuthSnackbarContext";

export default function AuthLayout(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });

  const showSnackbar = React.useCallback(
    (message: string, severity: "success" | "error" | "info") => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  // Xử lý snackbar message từ navigation state
  React.useEffect(() => {
    const state = location.state as {
      message?: string;
      severity?: "success" | "error" | "info";
    };
    if (state?.message) {
      setTimeout(() => {
        showSnackbar(state.message || "", state.severity || "info");
      }, 450);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, showSnackbar]);

  // ẩn scrollbar của body khi ở trang auth
  React.useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "auto";
    document.body.style.overflow = "hidden";
    document.body.style.scrollbarGutter = "auto";

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollbarGutter = "";
      document.body.style.overflow = "";
      document.body.style.scrollbarGutter = "";
    };
  }, []);

  return (
    <AuthSnackbarContext.Provider value={{ showSnackbar }}>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          py: 4,
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? `linear-gradient(180deg, #1B1C22 0%, #181922 35%, #13141A 100%)`
              : `linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)`,
          transition: "background 0.3s ease",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
      {/* button quay về trang chủ */}
      <Tooltip title="Về trang chủ" placement="right">
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: { xs: 16, sm: 24 },
            left: { xs: 16, sm: 24 },
            zIndex: 10,
            backgroundColor: (theme) => theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) =>
              theme.palette.mode === "light"
                ? "0 2px 8px rgba(15,23,42,0.06)"
                : "0 2px 8px rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#2A2B33" : "#F1F5F9",
              transform: "translateY(-2px)",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 4px 12px rgba(15,23,42,0.1)"
                  : "0 4px 12px rgba(0,0,0,0.4)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <Home sx={{ fontSize: { xs: 20, sm: 22 } }} />
        </IconButton>
      </Tooltip>

      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: 440, sm: 420 },
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: 1.5,
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 4px 20px rgba(15,23,42,0.06)"
              : "0 4px 20px rgba(0,0,0,0.3)",
          p: { xs: 3, sm: 3.5 },
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <AnimatePresence mode="wait">
          <DisintegrationTransition
            key={location.pathname}
            uniqueKey={location.pathname}
          >
            <Outlet />
          </DisintegrationTransition>
        </AnimatePresence>
      </Box>

      {/* Global Snackbar - nằm ngoài animated content */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={
          isMobile
            ? { vertical: "top", horizontal: "center" }
            : { vertical: "top", horizontal: "right" }
        }
        sx={{
          mt: isMobile ? 1 : 2,
          mr: isMobile ? 0 : 2,
          "& .MuiPaper-root": {
            borderRadius: 2,
            boxShadow: theme.shadows[6],
            minWidth: isMobile ? "90%" : 320,
          },
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            px: 2,
            py: 1,
            fontSize: 14,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </AuthSnackbarContext.Provider>
  );
}
