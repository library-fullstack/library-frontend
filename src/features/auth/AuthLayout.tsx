import * as React from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import bgBooks from "../../assets/img/background-login.jpg";

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
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        },
      }}
    >
      <AnimatePresence mode="wait">
        <Box
          component={motion.div}
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
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
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.1),
              inset 0 1px 0 rgba(255,255,255,0.4)
            `,
          }}
        >
          <Outlet />
        </Box>
      </AnimatePresence>
    </Box>
  );
}
