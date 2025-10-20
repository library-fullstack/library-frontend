import * as React from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * ForgotPasswordForm - Chỉ chứa nội dung form, không có background
 * Được render bên trong AuthLayout
 */
export default function ForgotPasswordForm(): React.ReactElement {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function handleForgotPassword(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:4000/api/v1/auth/forgot-password", {
        identifier,
      });
      setSuccess("Hướng dẫn đặt lại mật khẩu đã được gửi tới email của bạn!");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Có lỗi xảy ra");
      } else {
        setError("Lỗi không xác định");
      }
    }
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Typography
          align="center"
          sx={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.95)",
            mb: 2,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Quên mật khẩu
        </Typography>
        <Typography
          align="center"
          sx={{ fontSize: 13, color: "rgba(255,255,255,0.8)", mb: 3 }}
        >
          Nhập email hoặc mã sinh viên để nhận hướng dẫn
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleForgotPassword}>
        <Typography
          sx={{ fontSize: 13, color: "white", mb: 1, fontWeight: 500 }}
        >
          Mã sinh viên hoặc email
        </Typography>
        <TextField
          fullWidth
          placeholder="VD: 231032xxx24"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              background: "rgba(255,255,255,0.9)",
              borderRadius: "10px",
            },
          }}
        />

        <Button
          fullWidth
          type="submit"
          sx={{
            py: "10px",
            mb: 2,
            borderRadius: "10px",
            fontWeight: 600,
            background: "rgba(255,255,255,0.25)",
            color: "white",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(255,255,255,0.35)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Gửi yêu cầu
        </Button>

        <Typography
          textAlign="center"
          sx={{ color: "white", fontSize: "14px" }}
        >
          Nhớ lại mật khẩu?{" "}
          <Box
            component="span"
            onClick={() => navigate("/auth/login")}
            sx={{
              color: "#FFD8B0",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Quay lại đăng nhập
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
