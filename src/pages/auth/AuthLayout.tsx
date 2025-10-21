import * as React from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import DisintegrationTransition from "../../components/DisintegrationTransition";
import bgBooks from "../../assets/img/background-login.jpg";

// phần xử lí form đăng ký đăng nhập và quên mật khẩu
export default function AuthLayout(): React.ReactElement {
  const location = useLocation();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgBooks})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "20px",
          p: { xs: "30px 25px", md: "40px 35px" },
          width: "100%",
          maxWidth: 400,
          overflow: "hidden",
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.4)
          `,
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
