import * as React from "react";
import { Box, useTheme, IconButton, Tooltip } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home } from "@mui/icons-material";
import { AnimatePresence } from "framer-motion";
import DisintegrationTransition from "../../shared/ui/DisintegrationTransition";

export default function AuthLayout(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: 4,
        background: isDark
          ? "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)"
          : "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
        transition: "background 0.3s ease",
        position: "relative",
      }}
    >
      {/* Home Button */}
      <Tooltip title="Về trang chủ" placement="right">
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 24,
            left: 24,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 2px 8px rgba(15,23,42,0.06)"
                : "0 2px 8px rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#2A2B33" : "#F1F5F9",
              transform: "translateY(-2px)",
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 4px 12px rgba(15,23,42,0.1)"
                  : "0 4px 12px rgba(0,0,0,0.4)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <Home sx={{ fontSize: 22 }} />
        </IconButton>
      </Tooltip>

      <Box
        sx={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1.5,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 4px 20px rgba(15,23,42,0.06)"
              : "0 4px 20px rgba(0,0,0,0.3)",
          p: { xs: 3, sm: 4 },
          border: `1px solid ${theme.palette.divider}`,
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
    </Box>
  );
}
