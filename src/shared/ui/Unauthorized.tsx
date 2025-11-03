import * as React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export default function Unauthorized(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          theme.palette.mode === "light" ? "#F3E5F5" : "#1B1C22",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s ease",
      }}
    >
      {/* cho mờ mờ chút */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: 1,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.05)",
          filter: "blur(60px)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-30px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: 1,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.04)"
              : "rgba(255,255,255,0.04)",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />

      {/* nội dung */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          textAlign: "center",
          color: (theme) =>
            theme.palette.mode === "light" ? "#1B1C22" : "white",
          zIndex: 1,
          px: 3,
        }}
      >
        {/* 403 */}
        <MotionBox
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "120px", md: "180px" },
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#7c3aed",
                textShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              403
            </Typography>
          </Box>
        </MotionBox>

        {/* tiêu đề */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            Quyền hạn bị từ chối
          </Typography>
        </MotionBox>

        {/* phần mô tả */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Bạn không có quyền truy cập vào trang này. Có vẻ như tài khoản của
            bạn không đủ quyền thực hiện thao tác này.
          </Typography>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#7c3aed"
                    : "rgba(255,255,255,0.9)",
                color: (theme) =>
                  theme.palette.mode === "light" ? "white" : "#1B1C22",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 1,
                fontSize: "1rem",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#6d28d9"
                      : "rgba(255,255,255,0.8)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Quay về trang chủ
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                borderColor: (theme) =>
                  theme.palette.mode === "light" ? "#1B1C22" : "white",
                color: (theme) =>
                  theme.palette.mode === "light" ? "#1B1C22" : "white",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 1,
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Quay lại
            </Button>
          </Stack>
        </MotionBox>
      </MotionBox>
    </Box>
  );
}
